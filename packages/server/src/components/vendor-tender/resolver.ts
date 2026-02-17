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

      return repository.findByVendor(vendorId);
    },
  },

  Mutation: {
    participateInTender: (_: unknown, { input }: any) =>
      getService().participateInTender(input),

    updateTenderParticipation: (_: unknown, { input }: any) =>
      getService().updateParticipationStatus(input),
  },
};
