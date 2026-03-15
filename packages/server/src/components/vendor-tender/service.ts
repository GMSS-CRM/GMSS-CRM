import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IVendorTenderRepository,
  IVendorTenderService,
} from './types';
import ErrorInfo from '../common/error-info';
import { IVendorRepository } from '../vendor/types';
import { VendorTender, ParticipationStatus } from '../../entities/VendorTender';

@injectable()
export class VendorTenderService implements IVendorTenderService {
  constructor(
    @inject(TYPES.IVendorTenderRepository)
    private readonly repository: IVendorTenderRepository,

    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async participateInTender(input: any) {
    const vendor = await this.vendorRepository.findById(input.vendorId);
    if (!vendor || vendor.isDeleted) throw new Error(ErrorInfo.VENDOR_NOT_FOUND);

    // Check if a record already exists for this vendor+tender
    const existing = await this.repository.findByTender(input.tenderId)
      .then((list) => list.find((vt) => vt.vendorId === input.vendorId));

    if (existing) {
      return this.repository.updateFollowUp(existing.id, {
        participationStatus: ParticipationStatus.PARTICIPATED,
        isParticipating: true,
        quotedAmount: input.quotedAmount,
      });
    }

    return this.repository.createParticipation({
      vendorId: input.vendorId,
      tenderId: input.tenderId,
      participationStatus: ParticipationStatus.PARTICIPATED,
      isParticipating: true,
      quotedAmount: input.quotedAmount,
    });
  }

  async updateParticipationStatus(input: any) {
    const participation = await this.repository.findById(input.participationId);
    if (!participation) throw new Error(ErrorInfo.TENDER_PARTICIPATION_NOT_FOUND);
    return this.repository.updateFollowUp(input.participationId, {
      participationStatus: input.status,
    });
  }

  async getTenderFollowUps(tenderId: string): Promise<VendorTender[]> {
    return this.repository.findByTenderWithVendors(tenderId);
  }

  async updateFollowUp(id: string, data: Partial<VendorTender>): Promise<VendorTender> {
    const record = await this.repository.findById(id);
    if (!record) throw new Error('Vendor tender follow-up not found');
    return this.repository.updateFollowUp(id, data);
  }
}

