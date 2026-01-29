import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { IVendorContactPersonService, IVendorContactPersonRepository } from './types';
import ErrorInfo from '../common/error-info';
import { getCurrentEmail } from '../common/utils';

@injectable()
export class VendorContactPersonService implements IVendorContactPersonService {
  constructor(
    @inject(TYPES.IVendorContactPersonRepository)
    private readonly contactPersonRepository: IVendorContactPersonRepository
  ) {}

  async createContactPerson(input: any) {
    if (!input.vendorId || !input.vendorId.trim()) {
      throw new Error(ErrorInfo.VENDOR_ID_REQUIRED);
    }

    if (!input.name || input.name.trim() === '') {
      throw new Error(ErrorInfo.CONTACT_PERSON_NAME_REQUIRED);
    }

    if (!input.phoneNumber || input.phoneNumber.trim() === '') {
      throw new Error(ErrorInfo.PHONE_NUMBER_REQUIRED);
    }

    if (!input.email || input.email.trim() === '') {
      throw new Error(ErrorInfo.EMAIL_REQUIRED);
    }

    const createdBy = getCurrentEmail();

    return this.contactPersonRepository.createContactPerson({
      vendorId: input.vendorId,
      name: input.name.trim(),
      designation: input.designation ?? undefined,
      phoneNumber: input.phoneNumber.trim(),
      email: input.email.trim(),
      cc: input.cc ?? undefined,
      bcc: input.bcc ?? undefined,
      createdBy: createdBy,
      updatedBy: createdBy,
    });
  }

  async updateContactPerson(id: string, input: any) {
    const existingContact = await this.contactPersonRepository.findById(id);
    if (!existingContact) {
      throw new Error(ErrorInfo.CONTACT_PERSON_NOT_FOUND);
    }

    const updateData: any = { updatedBy: getCurrentEmail() };

    if (input.name !== null && input.name !== undefined) {
      updateData.name = input.name.trim();
    }

    if (input.designation !== null && input.designation !== undefined) {
      updateData.designation = input.designation || undefined;
    }

    if (input.phoneNumber !== null && input.phoneNumber !== undefined) {
      updateData.phoneNumber = input.phoneNumber.trim();
    }

    if (input.email !== null && input.email !== undefined) {
      updateData.email = input.email.trim();
    }

    if (input.cc !== null && input.cc !== undefined) {
      updateData.cc = input.cc || undefined;
    }

    if (input.bcc !== null && input.bcc !== undefined) {
      updateData.bcc = input.bcc || undefined;
    }

    return this.contactPersonRepository.updateContactPerson(id, updateData);
  }

  async deleteContactPerson(id: string) {
    const contact = await this.contactPersonRepository.findById(id);
    if (!contact) {
      throw new Error(ErrorInfo.CONTACT_PERSON_NOT_FOUND);
    }
    return this.contactPersonRepository.deleteContactPerson(id);
  }

  async deleteContactPersons(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error(ErrorInfo.NO_CONTACT_PERSONS_TO_DELETE);
    }
    return this.contactPersonRepository.deleteContactPersons(ids);
  }

  async getContactPersonById(id: string) {
    return this.contactPersonRepository.findById(id);
  }

  async getContactPersonsByVendorId(vendorId: string) {
    return this.contactPersonRepository.findByVendorId(vendorId);
  }

  async searchContactPerson(params: any) {
    return this.contactPersonRepository.search(params);
  }
}
