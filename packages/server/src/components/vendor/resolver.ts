import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorService>(TYPES.IVendorService);
};

export const vendorResolvers = {
  Query: {
    getVendorById: (_: unknown, { id }: any) => getService().getVendorById(id),
    searchVendors: (_: unknown, { searchInput }: any) => getService().searchVendor(searchInput as any),
  },

  Mutation: {
    createVendor: (_: unknown, { input }: any) =>
      getService().createVendor(input as any),

    /*uploadVendor: (_: unknown, { input }: any) =>
      getService().createVendor(input as any),*/

    updateVendor: (_: unknown, { id, input }: any) =>
      getService().updateVendor(id, input as any),

    deleteVendor: (_: unknown, { id }: any) => getService().deleteVendor(id),

    deleteVendors: (_: unknown, { ids }: any) => getService().deleteVendors(ids),
  },

  Vendor: {
    tags: (parent: any) => parent.tags || [],
    contactPersons: (parent: any) => parent.contactPersons || [],
    documents: (parent: any) => parent.documents || [],
  },
};
