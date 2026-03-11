import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { PaymentTerm } from '../../entities/PaymentTerm';
import { IPaymentTermRepository } from './repository';
import { IVendorRepository } from '../vendor/types';
import { getCurrentEmail } from '../common/utils';

export interface IPaymentTermService {
  createPaymentTerm(input: any): Promise<PaymentTerm>;
  updatePaymentTerm(input: any): Promise<PaymentTerm>;
  deletePaymentTerm(id: string): Promise<boolean>;
  getPaymentTermsByVendor(vendorId: string): Promise<PaymentTerm[]>;
}

@injectable()
export class PaymentTermService implements IPaymentTermService {
  constructor(
    @inject(TYPES.IPaymentTermRepository)
    private readonly repository: IPaymentTermRepository,

    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository
  ) {}

  async createPaymentTerm(input: any): Promise<PaymentTerm> {
    const vendor = await this.vendorRepository.findById(input.vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    return this.repository.createPaymentTerm({
      vendorId: input.vendorId,
      companyType: input.companyType,
      paymentTermType: input.paymentTermType,
      commissionStructure: input.commissionStructure,
      otherBenefits: input.otherBenefits ?? false,
      benefitDetails: input.benefitDetails,
      agreementDate: input.agreementDate ? new Date(input.agreementDate) : undefined,
      fillAmount: input.fillAmount,
      createdBy: getCurrentEmail(),
    });
  }

  async updatePaymentTerm(input: any): Promise<PaymentTerm> {
    const existing = await this.repository.findById(input.id);
    if (!existing) {
      throw new Error('Payment term not found');
    }

    const updateData: Partial<PaymentTerm> = {};
    if (input.paymentTermType !== undefined) updateData.paymentTermType = input.paymentTermType;
    if (input.commissionStructure !== undefined) updateData.commissionStructure = input.commissionStructure;
    if (input.otherBenefits !== undefined) updateData.otherBenefits = input.otherBenefits;
    if (input.benefitDetails !== undefined) updateData.benefitDetails = input.benefitDetails;
    if (input.agreementDate !== undefined) updateData.agreementDate = input.agreementDate ? new Date(input.agreementDate) : undefined;
    if (input.fillAmount !== undefined) updateData.fillAmount = input.fillAmount;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    return this.repository.updatePaymentTerm(input.id, updateData);
  }

  async deletePaymentTerm(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async getPaymentTermsByVendor(vendorId: string): Promise<PaymentTerm[]> {
    return this.repository.findByVendor(vendorId);
  }
}
