import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { PaymentTerm } from '../../entities/PaymentTerm';

export interface IPaymentTermRepository extends Repository<PaymentTerm> {
  findByVendor(vendorId: string): Promise<PaymentTerm[]>;
  findById(id: string): Promise<PaymentTerm | null>;
  createPaymentTerm(data: Partial<PaymentTerm>): Promise<PaymentTerm>;
  updatePaymentTerm(id: string, data: Partial<PaymentTerm>): Promise<PaymentTerm>;
}

@injectable()
export class PaymentTermRepository extends Repository<PaymentTerm> implements IPaymentTermRepository {
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(PaymentTerm, db.manager);
  }

  findByVendor(vendorId: string) {
    return this.find({ where: { vendorId }, order: { createdDate: 'DESC' } });
  }

  findById(id: string) {
    return this.findOne({ where: { id } });
  }

  createPaymentTerm(data: Partial<PaymentTerm>) {
    return this.save(this.create(data));
  }

  async updatePaymentTerm(id: string, data: Partial<PaymentTerm>): Promise<PaymentTerm> {
    await this.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update payment term');
    }
    return updated;
  }
}
