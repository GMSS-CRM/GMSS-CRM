import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { TenderContact } from '../../entities/TenderContact';
import { ITenderContactRepository } from './types';

@injectable()
export class TenderContactRepository
  extends Repository<TenderContact>
  implements ITenderContactRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(TenderContact, db.manager);
  }

  findByTenderId(tenderId: string): Promise<TenderContact[]> {
    return this.find({
      where: { tenderId },
      order: { createdDate: 'DESC' },
    });
  }

  async createContact(data: Partial<TenderContact>): Promise<TenderContact> {
    return this.save(this.create(data));
  }

  async updateContact(id: string, data: Partial<TenderContact>): Promise<TenderContact> {
    await this.update(id, data);
    return this.findOneByOrFail({ id });
  }

  async deleteContact(id: string): Promise<void> {
    await this.delete(id);
  }
}
