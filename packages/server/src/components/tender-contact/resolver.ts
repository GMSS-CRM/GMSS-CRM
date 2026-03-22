import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITenderContactService } from './types';

function getService(): ITenderContactService {
  return getContainer().get<ITenderContactService>(TYPES.ITenderContactService);
}

export const tenderContactResolvers = {
  Query: {
    getTenderContacts: (_: unknown, { tenderId }: { tenderId: string }) =>
      getService().getByTenderId(tenderId),
  },

  Mutation: {
    createTenderContact: (_: unknown, { input }: { input: Record<string, unknown> }) =>
      getService().create(input as any),

    updateTenderContact: (_: unknown, { id, input }: { id: string; input: Record<string, unknown> }) =>
      getService().update(id, input as any),

    deleteTenderContact: async (_: unknown, { id }: { id: string }) => {
      await getService().delete(id);
      return true;
    },
  },

  TenderContact: {
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date ? parent.createdDate.toISOString() : parent.createdDate,
    updatedDate: (parent: any) =>
      parent.updatedDate instanceof Date ? parent.updatedDate.toISOString() : parent.updatedDate,
  },
};
