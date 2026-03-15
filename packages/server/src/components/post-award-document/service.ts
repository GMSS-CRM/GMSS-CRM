import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { PostAwardDocument } from '../../entities/PostAwardDocument';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';
import { IPostAwardDocumentRepository, IPostAwardDocumentService } from './types';

@injectable()
export class PostAwardDocumentService implements IPostAwardDocumentService {
  constructor(
    @inject(TYPES.IPostAwardDocumentRepository)
    private readonly repo: IPostAwardDocumentRepository,
  ) {}

  getByPostAwardId(postAwardId: string): Promise<PostAwardDocument[]> {
    return this.repo.findByPostAwardId(postAwardId);
  }

  getByTenderId(tenderId: string): Promise<PostAwardDocument[]> {
    return this.repo.findByTenderId(tenderId);
  }

  getByStage(postAwardId: string, stage: PostAwardStage): Promise<PostAwardDocument[]> {
    return this.repo.findByStage(postAwardId, stage);
  }

  async upload(data: Partial<PostAwardDocument>): Promise<PostAwardDocument> {
    if (!data.postAwardId) throw new Error('Post award ID is required');
    if (!data.documentName) throw new Error('Document name is required');
    if (!data.documentUrl) throw new Error('Document URL is required');
    if (!data.stage) throw new Error('Stage is required');
    return this.repo.createDocument(data);
  }

  async remove(id: string): Promise<boolean> {
    return this.repo.deleteDocument(id);
  }
}
