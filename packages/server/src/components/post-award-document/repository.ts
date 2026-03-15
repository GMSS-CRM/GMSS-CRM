import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { PostAwardDocument } from '../../entities/PostAwardDocument';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';
import { IPostAwardDocumentRepository } from './types';

@injectable()
export class PostAwardDocumentRepository
  extends Repository<PostAwardDocument>
  implements IPostAwardDocumentRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(PostAwardDocument, db.manager);
  }

  findByPostAwardId(postAwardId: string): Promise<PostAwardDocument[]> {
    return this.find({
      where: { postAwardId },
      order: { createdDate: 'DESC' },
    });
  }

  findByTenderId(tenderId: string): Promise<PostAwardDocument[]> {
    return this.find({
      where: { tenderId },
      order: { createdDate: 'DESC' },
    });
  }

  findByStage(postAwardId: string, stage: PostAwardStage): Promise<PostAwardDocument[]> {
    return this.find({
      where: { postAwardId, stage },
      order: { createdDate: 'DESC' },
    });
  }

  async createDocument(data: Partial<PostAwardDocument>): Promise<PostAwardDocument> {
    return this.save(this.create(data));
  }

  async deleteDocument(id: string): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
