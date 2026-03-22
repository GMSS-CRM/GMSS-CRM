import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { ITenderService, ITenderRepository } from './types';
import { TenderStatus } from '../../entities/enums/TenderStatus';
import { VALID_TENDER_TRANSITIONS } from './constants';
import ErrorInfo from '../common/error-info';
import { getCurrentEmail } from '../common/utils';
import { DataSource } from 'typeorm';
import { TenderTag } from '../../entities/TenderTag';
import { VendorTag } from '../../entities/VendorTag';
import { VendorTender } from '../../entities/VendorTender';

@injectable()
export class TenderService implements ITenderService {
  constructor(
    @inject(TYPES.ITenderRepository) private readonly tenderRepository: ITenderRepository,
    @inject(TYPES.DbContext) private readonly db: DataSource,
  ) {}

  async createTender(input: any) {
    if (!input.name || input.name.trim() === '') {
      throw new Error(ErrorInfo.TENDER_NAME_REQUIRED);
    }

    const existingTender = await this.tenderRepository.findByName(input.name);
    if (existingTender) {
      throw new Error(ErrorInfo.TENDER_ALREADY_EXISTS);
    }

    const createdBy = getCurrentEmail();

    return this.tenderRepository.createTender({
      name: input.name.trim(),
      referenceNumber: input.referenceNumber ?? undefined,
      issuingDepartment: input.issuingDepartment ?? undefined,
      description: input.description ?? undefined,
      submissionDeadline: input.submissionDeadline
        ? new Date(input.submissionDeadline)
        : undefined,
      status: TenderStatus.DRAFT,
      createdBy: createdBy,
      updatedBy: createdBy,
    });
  }

  async updateTender(id: string, input: any) {
    const existingTender = await this.tenderRepository.findById(id);
    if (!existingTender) {
      throw new Error(ErrorInfo.TENDER_NOT_FOUND);
    }

    const updateData: any = { updatedBy: getCurrentEmail() };

    if (input.name !== null && input.name !== undefined) {
      const duplicate = await this.tenderRepository.findByName(input.name);
      if (duplicate && duplicate.id !== id) {
        throw new Error(ErrorInfo.TENDER_ALREADY_EXISTS);
      }
      updateData.name = input.name.trim();
    }

    if (input.referenceNumber !== undefined) {
      updateData.referenceNumber = input.referenceNumber;
    }
    if (input.issuingDepartment !== undefined) {
      updateData.issuingDepartment = input.issuingDepartment;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    if (input.submissionDeadline !== undefined) {
      updateData.submissionDeadline = input.submissionDeadline
        ? new Date(input.submissionDeadline)
        : null;
    }

    return this.tenderRepository.updateTender(id, updateData);
  }

  async changeTenderStatus(input: any) {
    const tender = await this.tenderRepository.findById(input.tenderId);
    if (!tender) {
      throw new Error(ErrorInfo.TENDER_NOT_FOUND);
    }

    const currentStatus = tender.status as TenderStatus;
    const nextStatus = input.status as TenderStatus;

    if (currentStatus === nextStatus) {
      throw new Error('Tender is already in this status');
    }

    const allowedTransitions = VALID_TENDER_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(nextStatus)) {
      throw new Error(
        `Invalid transition from ${currentStatus} to ${nextStatus}. Allowed: ${allowedTransitions.join(', ') || 'none'}`,
      );
    }

    const updateData: any = {
      status: nextStatus,
      updatedBy: getCurrentEmail(),
    };

    // Handle rejection reason
    if (nextStatus === TenderStatus.REJECTED && input.rejectionReason) {
      updateData.rejectionReason = input.rejectionReason;
    }

    // Clear rejection reason when moving out of REJECTED
    if (currentStatus === TenderStatus.REJECTED) {
      updateData.rejectionReason = null;
    }

    // Set mailSentAt timestamp
    if (nextStatus === TenderStatus.MAIL_SENT) {
      updateData.mailSentAt = new Date();
    }

    // Sync TenderTag records whenever tagIds are provided (MD tagging or NIT verify with tags)
    if (Array.isArray(input.tagIds) && input.tagIds.length > 0) {
      return this.db.transaction(async (manager) => {
        await manager.update('tender', input.tenderId, updateData);

        // Replace all existing tag associations (one tender = one tag)
        await manager.delete(TenderTag, { tenderId: input.tenderId });
        const newTags = input.tagIds.map((tagId: string) =>
          manager.create(TenderTag, { tenderId: input.tenderId, tagId }),
        );
        await manager.save(TenderTag, newTags);

        return this.tenderRepository.findById(input.tenderId);
      });
    }

    // When mail is sent, create VendorTender rows for every vendor linked via the tender's tags
    if (nextStatus === TenderStatus.MAIL_SENT) {
      return this.db.transaction(async (manager) => {
        await manager.update('tender', input.tenderId, updateData);

        // 1. Fetch all tag IDs attached to this tender
        const tenderTags = await manager.find(TenderTag, {
          where: { tenderId: input.tenderId },
        });
        const tagIds = tenderTags.map((tt) => tt.tagId);

        if (tagIds.length > 0) {
          // 2. Find all vendor IDs linked to those tags (only enableMail = true)
          const vendorTags = await manager
            .createQueryBuilder(VendorTag, 'vt')
            .where('vt.tagId IN (:...tagIds)', { tagIds })
            .andWhere('vt.enableMail = true')
            .getMany();

          // 3. Deduplicate vendor IDs
          const uniqueVendorIds = [...new Set(vendorTags.map((vt) => vt.vendorId))];

          // 4. Find already-existing VendorTender rows to avoid duplicates
          const existing = await manager.find(VendorTender, {
            where: uniqueVendorIds.map((vendorId) => ({ vendorId, tenderId: input.tenderId })),
          });
          const existingSet = new Set(existing.map((e) => e.vendorId));

          // 5. Insert only the missing ones
          const toCreate = uniqueVendorIds
            .filter((vendorId) => !existingSet.has(vendorId))
            .map((vendorId) =>
              manager.create(VendorTender, {
                vendorId,
                tenderId: input.tenderId,
              }),
            );

          if (toCreate.length > 0) {
            await manager.save(VendorTender, toCreate);
          }
        }

        return this.tenderRepository.findById(input.tenderId);
      });
    }

    return this.tenderRepository.updateTender(input.tenderId, updateData);
  }

  async seedTenderVendors(tenderId: string): Promise<boolean> {
    const tender = await this.tenderRepository.findById(tenderId);
    if (!tender) throw new Error(ErrorInfo.TENDER_NOT_FOUND);

    await this.db.transaction(async (manager) => {
      const tenderTags = await manager.find(TenderTag, { where: { tenderId } });
      const tagIds = tenderTags.map((tt) => tt.tagId);
      if (tagIds.length === 0) return;

      const vendorTags = await manager
        .createQueryBuilder(VendorTag, 'vt')
        .where('vt.tagId IN (:...tagIds)', { tagIds })
        .andWhere('vt.enableMail = true')
        .getMany();

      const uniqueVendorIds = [...new Set(vendorTags.map((vt) => vt.vendorId))];
      if (uniqueVendorIds.length === 0) return;

      const existing = await manager.find(VendorTender, {
        where: uniqueVendorIds.map((vendorId) => ({ vendorId, tenderId })),
      });
      const existingSet = new Set(existing.map((e) => e.vendorId));

      const toCreate = uniqueVendorIds
        .filter((vendorId) => !existingSet.has(vendorId))
        .map((vendorId) => manager.create(VendorTender, { vendorId, tenderId }));

      if (toCreate.length > 0) await manager.save(VendorTender, toCreate);
    });

    return true;
  }

  async deleteTender(id: string) {
    const tender = await this.tenderRepository.findById(id);
    if (!tender) {
      throw new Error(ErrorInfo.TENDER_NOT_FOUND);
    }
    // Soft delete
    return this.tenderRepository.updateTender(id, {
      isDeleted: true,
      deletedBy: getCurrentEmail(),
      deletedDate: new Date(),
    } as any).then(() => true);
  }

  async deleteTenders(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error(ErrorInfo.NO_TENDERS_TO_DELETE);
    }
    // Soft delete all
    const email = getCurrentEmail();
    await Promise.all(
      ids.map((id) =>
        this.tenderRepository.updateTender(id, {
          isDeleted: true,
          deletedBy: email,
          deletedDate: new Date(),
        } as any)
      )
    );
    return true;
  }

  async createTendersBatch(inputs: any[]): Promise<import('./types').CreateTendersBatchResult> {
    if (!inputs || inputs.length === 0) {
      return { created: [], skipped: [] };
    }

    const createdBy = getCurrentEmail();

    // Separate inputs into those with a referenceNumber and those without
    const withRef = inputs
      .map((i) => i.referenceNumber?.trim())
      .filter((r): r is string => Boolean(r));
    const withoutRefNames = inputs
      .filter((i) => !i.referenceNumber?.trim())
      .map((i) => i.name?.trim())
      .filter((n): n is string => Boolean(n));

    // Single round-trip to find all existing tenders
    const existing = await this.tenderRepository.findExisting(withRef, withoutRefNames);

    const existingRefSet = new Set(
      existing.map((t) => t.referenceNumber?.trim()).filter(Boolean),
    );
    const existingNameSet = new Set(existing.map((t) => t.name?.trim()));

    const toCreate: any[] = [];
    const skipped: import('./types').SkippedTenderInfo[] = [];

    for (const input of inputs) {
      const ref = input.referenceNumber?.trim();
      const name = input.name?.trim();

      if (!name) {
        skipped.push({ name: input.name ?? '(unnamed)', referenceNumber: ref, reason: 'Tender Title is required' });
        continue;
      }

      // Dedup key: referenceNumber first (when non-empty), else fall back to name
      const isDuplicate = ref ? existingRefSet.has(ref) : existingNameSet.has(name);

      if (isDuplicate) {
        skipped.push({ name, referenceNumber: ref, reason: 'Already exists in the system' });
      } else {
        toCreate.push(input);
        // Add to sets so sibling duplicates (within same batch) are also caught
        if (ref) existingRefSet.add(ref);
        else existingNameSet.add(name);
      }
    }

    const created = await Promise.all(
      toCreate.map((input) =>
        this.tenderRepository.createTender({
          name: input.name.trim(),
          referenceNumber: input.referenceNumber ?? undefined,
          issuingDepartment: input.issuingDepartment ?? undefined,
          description: input.description ?? undefined,
          submissionDeadline: input.submissionDeadline
            ? new Date(input.submissionDeadline)
            : undefined,
          status: TenderStatus.DRAFT,
          createdBy,
          updatedBy: createdBy,
        }),
      ),
    );

    return { created, skipped };
  }

  async getTenderById(id: string) {
    return this.tenderRepository.findById(id);
  }

  async getTenderByName(name: string) {
    return this.tenderRepository.findByName(name);
  }

  async searchTender(params: any) {
    return this.tenderRepository.search(params || {});
  }

  async silenceTenderCountdown(
    tenderId: string,
    reason: string,
    newDeadline?: string,
    remarks?: string,
  ) {
    const tender = await this.tenderRepository.findById(tenderId);
    if (!tender) {
      throw new Error(ErrorInfo.TENDER_NOT_FOUND);
    }

    const updateData: any = {
      status: reason,
      countdownSilenceReason: remarks ?? reason,
      updatedBy: getCurrentEmail(),
    };

    if (newDeadline) {
      updateData.updatedSubmissionDeadline = new Date(newDeadline);
    }

    const updated = await this.tenderRepository.updateTender(tenderId, updateData);
    if (!updated) {
      throw new Error(ErrorInfo.TENDER_NOT_FOUND);
    }
    return updated;
  }
}
