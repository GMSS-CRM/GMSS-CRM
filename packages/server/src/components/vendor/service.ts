import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { IVendorService, IVendorRepository } from './types';
import { VendorStatus, VendorType } from '../../entities/Vendor';
import ErrorInfo from '../common/error-info';

@injectable()
export class VendorService implements IVendorService {
  constructor(@inject(TYPES.IVendorRepository) private readonly vendorRepository: IVendorRepository) {}

  async createVendor(input: any, actor?: { email?: string }) {
    if (!input.name || input.name.trim() === '') {
      throw new Error(ErrorInfo.VENDOR_NAME_REQUIRED);
    }

    const existingVendor = await this.vendorRepository.findByName(input.name);
    if (existingVendor) {
      throw new Error(ErrorInfo.VENDOR_ALREADY_EXISTS);
    }

    return this.vendorRepository.createVendor({
      name: input.name.trim(),
      type: input.type ?? VendorType.VENDOR,
      status: input.status ?? VendorStatus.DRAFT,
      gstNumber: input.gstNumber ?? undefined,
      panNumber: input.panNumber ?? undefined,
      msmeUdyamNumber: input.msmeUdyamNumber ?? undefined,
      cinNumber: input.cinNumber ?? undefined,
      createdBy: actor?.email ?? 'SYSTEM',
      updatedBy: actor?.email ?? 'SYSTEM',
    });
  }

  async updateVendor(id: string, input: any) {
    const existingVendor = await this.vendorRepository.findById(id);
    if (!existingVendor) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    const updateData: any = { updatedBy: 'SYSTEM' };

    if (input.name !== null && input.name !== undefined) {
      const duplicate = await this.vendorRepository.findByName(input.name);
      if (duplicate && duplicate.id !== id) {
        throw new Error(ErrorInfo.VENDOR_ALREADY_EXISTS);
      }
      updateData.name = input.name.trim();
    }

    if (input.type !== null && input.type !== undefined) {
      updateData.type = input.type;
    }

    if (input.status !== null && input.status !== undefined) {
      updateData.status = input.status;
    }

    if (input.gstNumber !== null && input.gstNumber !== undefined) {
      updateData.gstNumber = input.gstNumber || undefined;
    }

    if (input.panNumber !== null && input.panNumber !== undefined) {
      updateData.panNumber = input.panNumber || undefined;
    }

    if (input.msmeUdyamNumber !== null && input.msmeUdyamNumber !== undefined) {
      updateData.msmeUdyamNumber = input.msmeUdyamNumber || undefined;
    }

    if (input.cinNumber !== null && input.cinNumber !== undefined) {
      updateData.cinNumber = input.cinNumber || undefined;
    }

    return this.vendorRepository.updateVendor(id, updateData);
  }

  async deleteVendor(id: string) {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }
    return this.vendorRepository.deleteVendor(id);
  }

  async deleteVendors(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error(ErrorInfo.NO_VENDORS_TO_DELETE);
    }
    return this.vendorRepository.deleteVendors(ids);
  }

  async getVendorById(id: string) {
    return this.vendorRepository.findById(id);
  }

  async getVendorByName(name: string) {
    return this.vendorRepository.findByName(name);
  }

  async searchVendor(params: any) {
    return this.vendorRepository.search(params as any);
  }
}
