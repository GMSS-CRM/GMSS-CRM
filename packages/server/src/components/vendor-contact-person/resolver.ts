import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorContactPersonService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorContactPersonService>(TYPES.IVendorContactPersonService);
};

export const vendorContactPersonResolvers = {
  Query: {
    getVendorContactPersonById: (_: unknown, { id }: any) =>
      getService().getContactPersonById(id),

    searchVendorContactPersons: (_: unknown, { searchInput }: any) =>
      getService().searchContactPerson(searchInput as any),
  },

  Mutation: {
    createVendorContactPerson: (_: unknown, { input }: any, context: any) =>
      getService().createContactPerson(input as any),

    updateVendorContactPerson: (_: unknown, { id, input }: any, context: any) =>
      getService().updateContactPerson(id, input as any),

    deleteVendorContactPerson: (_: unknown, { id }: any) =>
      getService().deleteContactPerson(id),

    deleteVendorContactPersons: (_: unknown, { ids }: any) =>
      getService().deleteContactPersons(ids),
  },
};
