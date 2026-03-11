import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Tender } from '../../entities/Tender';
import { ITenderRepository } from './types';

@injectable()
export class TenderRepository extends Repository<Tender> implements ITenderRepository {
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(Tender, dbContext.manager);
  }

  createTender(tender: Partial<Tender>) {
    return this.save(this.create(tender));
  }

  findById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['documents', 'tags', 'tags.tag'],
    });
  }

  findByName(name: string) {
    return this.findOne({
      where: { name },
    });
  }

  async findExisting(referenceNumbers: string[], names: string[]): Promise<Tender[]> {
    const query = this.createQueryBuilder('tender');
    const conditions: string[] = [];
    const params: Record<string, any> = {};

    if (referenceNumbers.length > 0) {
      conditions.push('tender.referenceNumber IN (:...refNums)');
      params.refNums = referenceNumbers;
    }

    if (names.length > 0) {
      conditions.push('tender.name IN (:...names)');
      params.names = names;
    }

    if (conditions.length === 0) return [];

    return query.where(conditions.join(' AND '), params).getMany();
  }

  search(params: { search?: string; status?: string; limit?: number; offset?: number }) {
    const query = this.createQueryBuilder('tender');

    // Exclude soft-deleted tenders
    query.where('tender.isDeleted = :isDeleted', { isDeleted: false });

    if (params.search) {
      query.andWhere('tender.name ILIKE :search', { search: `%${params.search}%` });
    }

    if (params.status) {
      query.andWhere('tender.status = :status', { status: params.status });
    }

    query.leftJoinAndSelect('tender.documents', 'documents');
    query.leftJoinAndSelect('tender.tags', 'tags');
    query.leftJoinAndSelect('tags.tag', 'tag');

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    return query.getMany();
  }

  updateTender(id: string, tender: Partial<Tender>) {
    return this.update(id, tender).then(() => this.findById(id));
  }

  deleteTender(id: string) {
    return this.delete(id).then(() => true);
  }

  deleteTenders(ids: string[]) {
    return this.delete(ids).then(() => true);
  }
}
