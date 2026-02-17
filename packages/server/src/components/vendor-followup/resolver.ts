import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorFollowUpService } from './types';
import { IVendorFollowUpRepository } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorFollowUpService>(
    TYPES.IVendorFollowUpService
  );
};

export const vendorFollowUpResolvers = {
  Query: {
    getVendorFollowUps: async (_: unknown, { vendorId }: any) => {
      const container = getContainer();
      const repository =
        container.get<IVendorFollowUpRepository>(
          TYPES.IVendorFollowUpRepository
        );

      return repository.findByVendorId(vendorId);
    },
  },

  Mutation: {
    createVendorFollowUp: (_: unknown, { input }: any) =>
      getService().createFollowUp(input),

    completeVendorFollowUp: (_: unknown, { input }: any) =>
      getService().completeFollowUp(input),
  },
};
