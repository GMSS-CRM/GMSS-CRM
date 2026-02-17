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

  async createVendor(input: any) {
    if (!input.name) {
      throw new Error(ErrorInfo.VENDOR_NAME_REQUIRED);
    }

    const existing = await this.vendorRepository.findByName(
      input.name
    );

    if (existing) {
      throw new Error(ErrorInfo.VENDOR_ALREADY_EXISTS);
    }

    return this.vendorRepository.createVendor({
      name: input.name.trim(),
      type: input.type,
      isRailwayLinked: input.isRailwayLinked ?? false,
      createdBy: getCurrentEmail(),
      updatedBy: getCurrentEmail(),
    });
  }

  async updateVendor(id: string, input: any) {
    const vendor = await this.vendorRepository.findById(id);

    if (!vendor) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    return this.vendorRepository.updateVendor(id, {
      ...input,
      updatedBy: getCurrentEmail(),
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
