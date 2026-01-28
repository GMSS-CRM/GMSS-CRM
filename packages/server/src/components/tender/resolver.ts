import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITenderService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<ITenderService>(TYPES.ITenderService);
};

export const tenderResolvers = {
  Query: {
    getTenderById: (_: unknown, { id }: any) => getService().getTenderById(id),
    searchTenders: (_: unknown, { searchInput }: any) => getService().searchTender(searchInput as any),
  },

  Mutation: {
    createTender: (_: unknown, { input }: any, context: any) =>
      getService().createTender(input as any),

    updateTender: (_: unknown, { id, input }: any, context: any) =>
      getService().updateTender(id, input as any),

    deleteTender: (_: unknown, { id }: any) => getService().deleteTender(id),

    deleteTenders: (_: unknown, { ids }: any) => getService().deleteTenders(ids),
  },

  Tender: {
    documents: (parent: any) => parent.documents || [],
    tags: (parent: any) => parent.tags || [],
  },
};
