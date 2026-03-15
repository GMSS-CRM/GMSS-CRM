import { PostAwardDocument } from '../../entities/PostAwardDocument';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';

export interface IPostAwardDocumentRepository {
  findByPostAwardId(postAwardId: string): Promise<PostAwardDocument[]>;
  findByTenderId(tenderId: string): Promise<PostAwardDocument[]>;
  findByStage(postAwardId: string, stage: PostAwardStage): Promise<PostAwardDocument[]>;
  createDocument(data: Partial<PostAwardDocument>): Promise<PostAwardDocument>;
  deleteDocument(id: string): Promise<boolean>;
}

export interface IPostAwardDocumentService {
  getByPostAwardId(postAwardId: string): Promise<PostAwardDocument[]>;
  getByTenderId(tenderId: string): Promise<PostAwardDocument[]>;
  getByStage(postAwardId: string, stage: PostAwardStage): Promise<PostAwardDocument[]>;
  upload(data: Partial<PostAwardDocument>): Promise<PostAwardDocument>;
  remove(id: string): Promise<boolean>;
}
