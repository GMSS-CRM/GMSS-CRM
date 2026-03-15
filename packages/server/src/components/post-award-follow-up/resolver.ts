import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IPostAwardFollowUpService } from './types';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';

function getService(): IPostAwardFollowUpService {
  return getContainer().get<IPostAwardFollowUpService>(TYPES.IPostAwardFollowUpService);
}

export const postAwardFollowUpResolvers = {
  Query: {
    getPostAwardFollowUps: (_: unknown, { postAwardId }: { postAwardId: string }) =>
      getService().getByPostAwardId(postAwardId),

    getPostAwardFollowUpsByTender: (_: unknown, { tenderId }: { tenderId: string }) =>
      getService().getByTenderId(tenderId),

    getPostAwardFollowUpsByStage: (
      _: unknown,
      { postAwardId, stage }: { postAwardId: string; stage: PostAwardStage },
    ) => getService().getByStage(postAwardId, stage),

    getPendingPostAwardFollowUps: () => getService().getPending(),

    getOverduePostAwardFollowUps: () => getService().getOverdue(),
  },

  Mutation: {
    createPostAwardFollowUp: (_: unknown, { input }: { input: any }) =>
      getService().create(input),

    updatePostAwardFollowUp: (_: unknown, { input }: { input: any }) => {
      const { id, ...data } = input;
      return getService().update(id, data);
    },

    completePostAwardFollowUp: (_: unknown, { id, outcome }: { id: string; outcome: string }) =>
      getService().complete(id, outcome),
  },

  PostAwardFollowUp: {
    followUpDate: (parent: any) =>
      parent.followUpDate instanceof Date ? parent.followUpDate.toISOString() : parent.followUpDate ?? null,
    nextFollowUpDate: (parent: any) =>
      parent.nextFollowUpDate instanceof Date ? parent.nextFollowUpDate.toISOString() : parent.nextFollowUpDate ?? null,
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date ? parent.createdDate.toISOString() : parent.createdDate,
    updatedDate: (parent: any) =>
      parent.updatedDate instanceof Date ? parent.updatedDate.toISOString() : parent.updatedDate,
  },
};
