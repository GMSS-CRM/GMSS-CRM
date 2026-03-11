import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import {
  IVendorTenderService,
  IVendorTenderRepository,
} from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorTenderService>(
    TYPES.IVendorTenderService
  );
};

export const vendorTenderResolvers = {
  Query: {
    getVendorTenders: async (_: unknown, { vendorId }: any) => {
      const container = getContainer();
      const repository =
        container.get<IVendorTenderRepository>(
          TYPES.IVendorTenderRepository
        );

      return repository.findByVendorWithTender(vendorId);
    },

    getSharedTenders: async (_: unknown, { vendorId }: any) => {
      const container = getContainer();
      const repository =
        container.get<IVendorTenderRepository>(
          TYPES.IVendorTenderRepository
        );

      const allTenders = await repository.findByVendorWithTender(vendorId);
      // Filter for tenders that have been shared (where tender has mailSentAt)
      return allTenders.filter((vt) => vt.tender && vt.tender.mailSentAt);
    },
  },

  Mutation: {
    participateInTender: (_: unknown, { input }: any) =>
      getService().participateInTender(input),

    updateTenderParticipation: (_: unknown, { input }: any) =>
      getService().updateParticipationStatus(input),
  },
};
