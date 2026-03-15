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
    searchTendersAdvanced: (_: unknown, { searchInput }: any) => getService().searchTender(searchInput as any),
  },

  Mutation: {
    createTender: (_: unknown, { input }: any) =>
      getService().createTender(input as any),

    createTendersBatch: (_: unknown, { inputs }: any) =>
      getService().createTendersBatch(inputs as any[]),

    updateTender: (_: unknown, { id, input }: any) =>
      getService().updateTender(id, input as any),

    deleteTender: (_: unknown, { id }: any) => getService().deleteTender(id),

    deleteTenders: (_: unknown, { ids }: any) => getService().deleteTenders(ids),

    changeTenderStatus: (_: unknown, { input }: any) =>
      getService().changeTenderStatus(input as any),

    seedTenderVendors: (_: unknown, { tenderId }: any) =>
      getService().seedTenderVendors(tenderId),
  },

  Tender: {
    documents: (parent: any) => parent.documents || [],
    tags: (parent: any) => parent.tags || [],
    submissionDeadline: (parent: any) =>
      parent.submissionDeadline instanceof Date
        ? parent.submissionDeadline.toISOString()
        : parent.submissionDeadline ?? null,
  },
};
