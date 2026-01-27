import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Tag } from '../../entities/Tag';
import { ITagRepository } from './types';

@injectable()
export class TagRepository extends Repository<Tag> implements ITagRepository {
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(Tag, dbContext.manager);
  }

  createTag(tag: Partial<Tag>) {
    return this.save(this.create(tag));
  }

  findById(id: string) {
    return this.findOne({
      where: { id },
    });
  }

  findByName(name: string) {
    return this.findOne({
      where: { name },
    });
  }

  search(params: { search?: string; limit?: number; offset?: number }) {
    const query = this.createQueryBuilder('tag');

    if (params.search) {
      query.where('tag.name ILIKE :search', { search: `%${params.search}%` });
    }

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    return query.getMany();
  }

  updateTag(id: string, tag: Partial<Tag>) {
    return this.update(id, tag).then(() => this.findById(id));
  }

  deleteTag(id: string) {
    return this.delete(id).then(() => true);
  }

  deleteTags(ids: string[]) {
    return this.delete(ids).then(() => true);
  }
}
