import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { TenderDocument } from '../../entities/TenderDocument';
import { ITenderDocumentRepository } from './types';

@injectable()
export class TenderDocumentRepository extends Repository<TenderDocument> implements ITenderDocumentRepository {
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(TenderDocument, dbContext.manager);
  }

  createDocument(doc: Partial<TenderDocument>) {
    return this.save(this.create(doc));
  }

  findById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['tender'],
    });
  }

  findByTenderId(tenderId: string) {
    return this.find({
      where: { tenderId },
      relations: ['tender'],
    });
  }

  search(params: { tenderId?: string; search?: string; limit?: number; offset?: number }) {
    const query = this.createQueryBuilder('document');

    if (params.tenderId) {
      query.where('document.tenderId = :tenderId', { tenderId: params.tenderId });
    }

    if (params.search) {
      query.andWhere('document.documentName ILIKE :search', { search: `%${params.search}%` });
    }

    query.leftJoinAndSelect('document.tender', 'tender');

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    return query.getMany();
  }

  updateDocument(id: string, doc: Partial<TenderDocument>) {
    return this.update(id, doc).then(() => this.findById(id));
  }

  deleteDocument(id: string) {
    return this.delete(id).then(() => true);
  }

  deleteDocuments(ids: string[]) {
    return this.delete(ids).then(() => true);
  }
}
