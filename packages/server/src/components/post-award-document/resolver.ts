import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IPostAwardDocumentService } from './types';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';

function getService(): IPostAwardDocumentService {
  return getContainer().get<IPostAwardDocumentService>(TYPES.IPostAwardDocumentService);
}

export const postAwardDocumentResolvers = {
  Query: {
    getPostAwardDocuments: (_: unknown, { postAwardId }: { postAwardId: string }) =>
      getService().getByPostAwardId(postAwardId),

    getPostAwardDocumentsByTender: (_: unknown, { tenderId }: { tenderId: string }) =>
      getService().getByTenderId(tenderId),

    getPostAwardDocumentsByStage: (
      _: unknown,
      { postAwardId, stage }: { postAwardId: string; stage: PostAwardStage },
    ) => getService().getByStage(postAwardId, stage),
  },

  Mutation: {
    uploadPostAwardDocument: (_: unknown, { input }: { input: any }) =>
      getService().upload(input),

    deletePostAwardDocument: (_: unknown, { id }: { id: string }) =>
      getService().remove(id),
  },

  PostAwardDocument: {
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date ? parent.createdDate.toISOString() : parent.createdDate,
  },
};
