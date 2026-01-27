import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorContactPerson } from '../../entities/VendorContactPerson';
import { IVendorContactPersonRepository } from './types';

@injectable()
export class VendorContactPersonRepository
  extends Repository<VendorContactPerson>
  implements IVendorContactPersonRepository
{
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(VendorContactPerson, dbContext.manager);
  }

  createContactPerson(contact: Partial<VendorContactPerson>) {
    return this.save(this.create(contact));
  }

  findById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['vendor'],
    });
  }

  findByVendorId(vendorId: string) {
    return this.find({
      where: { vendorId },
      relations: ['vendor'],
    });
  }

  search(params: { vendorId?: string; search?: string; limit?: number; offset?: number }) {
    const query = this.createQueryBuilder('contact');

    if (params.vendorId) {
      query.where('contact.vendorId = :vendorId', { vendorId: params.vendorId });
    }

    if (params.search) {
      query.andWhere(
        '(contact.name ILIKE :search OR contact.email ILIKE :search OR contact.phoneNumber ILIKE :search)',
        { search: `%${params.search}%` }
      );
    }

    query.leftJoinAndSelect('contact.vendor', 'vendor');

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    return query.getMany();
  }

  updateContactPerson(id: string, contact: Partial<VendorContactPerson>) {
    return this.update(id, contact).then(() => this.findById(id));
  }

  deleteContactPerson(id: string) {
    return this.delete(id).then(() => true);
  }

  deleteContactPersons(ids: string[]) {
    return this.delete(ids).then(() => true);
  }
}
