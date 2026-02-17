import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IVendorTenderRepository,
  IVendorTenderService,
} from './types';
import ErrorInfo from '../common/error-info';
import { IVendorRepository } from '../vendor/types';
import { VendorStatus } from '../../entities/enums/VendorStatus';
import { getCurrentEmail } from '../common/utils';
import { ParticipationStatus } from '../../entities/VendorTender';

@injectable()
export class VendorTenderService
  implements IVendorTenderService
{
  constructor(
    @inject(TYPES.IVendorTenderRepository)
    private readonly repository: IVendorTenderRepository,

    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository
  ) {}

  async participateInTender(input: any) {
    const vendor = await this.vendorRepository.findById(
      input.vendorId
    );

    if (!vendor || vendor.isDeleted) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    if (vendor.status !== VendorStatus.FINAL) {
      throw new Error(
        ErrorInfo.VENDOR_ALREADY_PARTICIPATING
      );
    }

    return this.repository.createParticipation({
    vendorId: input.vendorId,
    tenderId: input.tenderId,
    participationStatus: ParticipationStatus.PARTICIPATED,
    isParticipating: true,
  });
  }

  async updateParticipationStatus(input: any) {
    const participation =
      await this.repository.findById(input.participationId);

    if (!participation) {
      throw new Error(ErrorInfo.TENDER_PARTICIPATION_NOT_FOUND);
    }

    return this.repository.updateParticipation(
      input.participationId,
      {
        participationStatus: input.status,
      }
    );
  }
}
