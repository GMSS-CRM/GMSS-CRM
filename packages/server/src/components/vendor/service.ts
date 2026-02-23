import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { IVendorRepository, IVendorService } from './types';
import ErrorInfo from '../common/error-info';
import { VendorStatus } from '../../entities/enums/VendorStatus';
import { getCurrentEmail } from '../common/utils';
import { VALID_VENDOR_TRANSITIONS } from './constants';
import { VendorWorkflow } from '../../entities/VendorWorkflow';
import { DataSource } from 'typeorm';
import { Vendor } from '../../entities/Vendor';
import { IVendorAgreementRepository } from '../vendor-agreement/types';
import { SignatureStatus } from '../../entities/enums/SignatureStatus';


@injectable()
export class VendorService implements IVendorService {
  constructor(
    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository,

    @inject(TYPES.IVendorAgreementRepository)
    private readonly agreementRepository: IVendorAgreementRepository,


    @inject(TYPES.DbContext)
    private readonly db: DataSource
  ) { }

  async createVendor(input: any): Promise<Vendor> {
  if (!input.name?.trim()) {
    throw new Error(ErrorInfo.VENDOR_NAME_REQUIRED);
  }

  const existing = await this.vendorRepository.findByName(
    input.name.trim()
  );

  if (existing) {
    throw new Error(ErrorInfo.VENDOR_ALREADY_EXISTS);
  }

  return this.db.transaction(async (manager) => {
    /* ------------------ CREATE VENDOR ------------------ */

    const vendorRepo = manager.getRepository(Vendor);

    const vendor = vendorRepo.create({
      name: input.name.trim(),
      type: input.type,
      isRailwayLinked: input.isRailwayLinked ?? false,
      gstNumber: input.gstNumber,
      panNumber: input.panNumber,
      cinNumber: input.cinNumber,
      msmeUdyamNumber: input.msmeUdyamNumber,
      address: input.address,
      status: VendorStatus.NEW,
      createdBy: getCurrentEmail(),
      updatedBy: getCurrentEmail(),
    });

    const savedVendor = await vendorRepo.save(vendor);

    /* ------------------ CREATE CONTACT PERSONS ------------------ */

    if (Array.isArray(input.contactPersons)) {
      for (const cp of input.contactPersons) {
        if (!cp.name || !cp.phoneNumber || !cp.email) continue;

        await manager.insert('vendor_contact_person', {
          vendorId: savedVendor.id,
          name: cp.name,
          designation: cp.designation,
          phoneNumber: cp.phoneNumber,
          email: cp.email,
          cc: cp.cc,
          bcc: cp.bcc,
          createdBy: getCurrentEmail(),
        });
      }
    }

    /* ------------------ CREATE DOCUMENTS ------------------ */

    if (Array.isArray(input.documents)) {
      for (const doc of input.documents) {
        if (!doc.documentName || !doc.documentUrl) continue;

        await manager.insert('vendor_document', {
          vendorId: savedVendor.id,
          documentName: doc.documentName,
          documentUrl: doc.documentUrl,
          expiresOn: doc.expiresOn
            ? new Date(doc.expiresOn)
            : null,
          createdBy: getCurrentEmail(),
        });
      }
    }

    /* ------------------ RETURN FULL OBJECT ------------------ */

    return vendorRepo.findOne({
      where: { id: savedVendor.id },
      relations: [
        'contactPersons',
        'documents',
        'workflows',
        'approvals',
        'proposals',
        'agreements',
        'followUps',
        'tenders',
      ],
    }) as Promise<Vendor>;
  });
}

 async updateVendor(id: string, input: any): Promise<Vendor> {
  const existingVendor = await this.vendorRepository.findById(id);

  if (!existingVendor) {
    throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
  }

  return this.db.transaction(async (manager) => {
    const vendorRepo = manager.getRepository(Vendor);

    /* ------------------ UPDATE BASIC INFO ------------------ */

    // Extract relationship fields that shouldn't be in UPDATE query
    const { contactPersons, documents, ...basicInfo } = input;

    await vendorRepo.update(id, {
      ...basicInfo,
      updatedBy: getCurrentEmail(),
    });

    /* ------------------ CONTACT PERSON SYNC ------------------ */

    if (Array.isArray(input.contactPersons)) {
      const existingCPs = existingVendor.contactPersons || [];
      const incomingCPs = input.contactPersons;

      // Delete removed
      for (const oldCp of existingCPs) {
        if (!incomingCPs.find((c: any) => c.id === oldCp.id)) {
          await manager.delete('vendor_contact_person', {
            id: oldCp.id,
          });
        }
      }

      for (const cp of incomingCPs) {
        if (cp.id) {
          // Update existing
          await manager.update(
            'vendor_contact_person',
            { id: cp.id },
            {
              name: cp.name,
              designation: cp.designation,
              phoneNumber: cp.phoneNumber,
              email: cp.email,
              cc: cp.cc,
              bcc: cp.bcc,
              updatedBy: getCurrentEmail(),
            }
          );
        } else {
          // Create new
          await manager.insert('vendor_contact_person', {
            vendorId: id,
            name: cp.name,
            designation: cp.designation,
            phoneNumber: cp.phoneNumber,
            email: cp.email,
            cc: cp.cc,
            bcc: cp.bcc,
            createdBy: getCurrentEmail(),
          });
        }
      }
    }

    /* ------------------ DOCUMENT SYNC ------------------ */

    if (Array.isArray(input.documents)) {
      const existingDocs = existingVendor.documents || [];
      const incomingDocs = input.documents;

      // Delete removed
      for (const oldDoc of existingDocs) {
        if (!incomingDocs.find((d: any) => d.id === oldDoc.id)) {
          await manager.delete('vendor_document', {
            id: oldDoc.id,
          });
        }
      }

      for (const doc of incomingDocs) {
        if (doc.id) {
          await manager.update(
            'vendor_document',
            { id: doc.id },
            {
              documentName: doc.documentName,
              documentUrl: doc.documentUrl,
              expiresOn: doc.expiresOn
                ? new Date(doc.expiresOn)
                : null,
              updatedBy: getCurrentEmail(),
            }
          );
        } else {
          await manager.insert('vendor_document', {
            vendorId: id,
            documentName: doc.documentName,
            documentUrl: doc.documentUrl,
            expiresOn: doc.expiresOn
              ? new Date(doc.expiresOn)
              : null,
            createdBy: getCurrentEmail(),
          });
        }
      }
    }

    /* ------------------ RETURN UPDATED ------------------ */

    return vendorRepo.findOne({
      where: { id },
      relations: [
        'contactPersons',
        'documents',
        'workflows',
        'approvals',
        'proposals',
        'agreements',
        'followUps',
        'tenders',
      ],
    }) as Promise<Vendor>;
  });
}

  async deleteVendor(id: string) {
    return this.vendorRepository.softDeleteVendor(
      id,
      getCurrentEmail()
    );
  }

  async deleteVendors(ids: string[]) {
    return Promise.all(
      ids.map((id) =>
        this.vendorRepository.softDeleteVendor(
          id,
          getCurrentEmail()
        )
      )
    );
  }

  async changeStatus(
    vendorId: string,
    newStatus: VendorStatus,
    remarks?: string
  ) {
    const vendor = await this.vendorRepository.findById(
      vendorId
    );

    if (!vendor) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    const currentStatus = vendor.status;

    if (currentStatus === newStatus) {
      throw new Error(ErrorInfo.VENDOR_STATUS_SAME);
    }

    // 🔥 FINAL HARD GUARD
    if (newStatus === VendorStatus.FINAL) {
      const agreements =
        await this.agreementRepository.findByVendorId(
          vendorId
        );

      const signedAgreement = agreements.find(
        (a) =>
          a.signatureStatus === SignatureStatus.SIGNED
      );

      if (!signedAgreement) {
        throw new Error(
          ErrorInfo.VENDOR_FINAL_REQUIRES_SIGNED_AGREEMENT
        );
      }
    }

    const allowed =
      VALID_VENDOR_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Invalid transition from ${currentStatus} to ${newStatus}`
      );
    }

    return this.db.transaction(async (manager) => {
      vendor.status = newStatus;
      vendor.updatedBy = getCurrentEmail();

      await manager.getRepository(Vendor).save(vendor);

      const workflow = manager.create(
        VendorWorkflow,
        {
          vendorId,
          fromStatus: currentStatus,
          toStatus: newStatus,
          remarks,
          changedBy: getCurrentEmail(),
        }
      );

      await manager.save(workflow);

      return vendor;
    });
  }


  async getVendorById(id: string) {
    return this.vendorRepository.findById(id);
  }

  async searchVendor(params: any) {
    return this.vendorRepository.search(params || {});
  }
}
