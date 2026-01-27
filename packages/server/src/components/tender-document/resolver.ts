import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITenderDocumentService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<ITenderDocumentService>(TYPES.ITenderDocumentService);
};

export const tenderDocumentResolvers = {
  Query: {
    getTenderDocumentById: (_: unknown, { id }: any) => getService().getDocumentById(id),
    searchTenderDocuments: (_: unknown, { searchInput }: any) => getService().searchDocument(searchInput as any),
  },

  Mutation: {
    createTenderDocument: (_: unknown, { input }: any, context: any) =>
      getService().createDocument(input as any, { email: context?.user?.email }),

    updateTenderDocument: (_: unknown, { id, input }: any, context: any) =>
      getService().updateDocument(id, input as any),

    deleteTenderDocument: (_: unknown, { id }: any) => getService().deleteDocument(id),

    deleteTenderDocuments: (_: unknown, { ids }: any) => getService().deleteDocuments(ids),
  },
};
