import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorDocument } from '../../entities/VendorDocument';
import { IVendorDocumentRepository } from './types';

@injectable()
export class VendorDocumentRepository
  extends Repository<VendorDocument>
  implements IVendorDocumentRepository
{
  constructor(
    @inject(TYPES.DbContext)
    private readonly dbContext: DataSource
  ) {
    super(VendorDocument, dbContext.manager);
  }

  async createDocument(doc: Partial<VendorDocument>) {
    const entity = this.create(doc);
    return this.save(entity);
  }

  async findById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['vendor'],
    });
  }

  async findByVendorId(vendorId: string) {
    return this.find({
      where: { vendorId },
      relations: ['vendor'],
    });
  }

  async search(params: {
    vendorId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const query = this.createQueryBuilder('document')
      .leftJoinAndSelect('document.vendor', 'vendor');

    if (params.vendorId) {
      query.andWhere('document.vendorId = :vendorId', {
        vendorId: params.vendorId,
      });
    }

    if (params.search) {
      query.andWhere(
        'LOWER(document.documentName) LIKE LOWER(:search)',
        { search: `%${params.search}%` }
      );
    }

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    return query.getMany();
  }

  async updateDocument(
    id: string,
    doc: Partial<VendorDocument>
  ) {
    const existing = await this.findOne({ where: { id } });

    if (!existing) {
      throw new Error('Vendor document not found');
    }

    Object.assign(existing, doc);

    return this.save(existing);
  }

  async deleteDocument(id: string) {
    const result = await this.delete(id);
    return result.affected ? true : false;
  }

  async deleteDocuments(ids: string[]) {
    const result = await this.delete(ids);
    return result.affected ? true : false;
  }
}