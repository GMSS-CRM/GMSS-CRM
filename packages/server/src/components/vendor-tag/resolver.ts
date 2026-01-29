import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorTagService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorTagService>(TYPES.IVendorTagService);
};

export const vendorTagResolvers = {
  Query: {
    getVendorsByTag: (_: unknown, { tagId }: any) =>
      getService().getVendorsByTag(tagId),
  },

  Mutation: {
    createVendorTag: (_: unknown, { input }: any) =>
      getService().createVendorTag(input as any),

    deleteVendorTag: (_: unknown, { id }: any) =>
      getService().deleteVendorTag(id),
  },
};
