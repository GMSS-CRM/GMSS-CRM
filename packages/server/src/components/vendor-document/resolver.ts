import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorDocumentService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorDocumentService>(TYPES.IVendorDocumentService);
};

export const vendorDocumentResolvers = {
  Query: {
    getVendorDocumentById: (_: unknown, { id }: any) => getService().getDocumentById(id),
    searchVendorDocuments: (_: unknown, { searchInput }: any) => getService().searchDocument(searchInput as any),
  },

  Mutation: {
    createVendorDocument: (_: unknown, { input }: any, context: any) =>
      getService().createDocument(input as any, { email: context?.user?.email }),

    updateVendorDocument: (_: unknown, { id, input }: any, context: any) =>
      getService().updateDocument(id, input as any),

    deleteVendorDocument: (_: unknown, { id }: any) => getService().deleteDocument(id),

    deleteVendorDocuments: (_: unknown, { ids }: any) => getService().deleteDocuments(ids),
  },
};
