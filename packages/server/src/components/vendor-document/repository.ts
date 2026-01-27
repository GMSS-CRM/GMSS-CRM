import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorDocument } from '../../entities/VendorDocument';
import { IVendorDocumentRepository } from './types';

@injectable()
export class VendorDocumentRepository extends Repository<VendorDocument> implements IVendorDocumentRepository {
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(VendorDocument, dbContext.manager);
  }

  createDocument(doc: Partial<VendorDocument>) {
    return this.save(this.create(doc));
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
    const query = this.createQueryBuilder('document');

    if (params.vendorId) {
      query.where('document.vendorId = :vendorId', { vendorId: params.vendorId });
    }

    if (params.search) {
      query.andWhere('document.documentName ILIKE :search', { search: `%${params.search}%` });
    }

    query.leftJoinAndSelect('document.vendor', 'vendor');

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    return query.getMany();
  }

  updateDocument(id: string, doc: Partial<VendorDocument>) {
    return this.update(id, doc).then(() => this.findById(id));
  }

  deleteDocument(id: string) {
    return this.delete(id).then(() => true);
  }

  deleteDocuments(ids: string[]) {
    return this.delete(ids).then(() => true);
  }
}
