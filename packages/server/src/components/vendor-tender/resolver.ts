import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import {
  IVendorTenderService,
  IVendorTenderRepository,
} from './types';

const getService = () =>
  getContainer().get<IVendorTenderService>(TYPES.IVendorTenderService);

export const vendorTenderResolvers = {
  Query: {
    getVendorTenders: (_: unknown, { vendorId }: any) => {
      const repository = getContainer().get<IVendorTenderRepository>(TYPES.IVendorTenderRepository);
      return repository.findByVendorWithTender(vendorId);
    },

    getSharedTenders: async (_: unknown, { vendorId }: any) => {
      const repository = getContainer().get<IVendorTenderRepository>(TYPES.IVendorTenderRepository);
      const allTenders = await repository.findByVendorWithTender(vendorId);
      return allTenders.filter((vt) => vt.tender && vt.tender.mailSentAt);
    },

    getTenderFollowUps: (_: unknown, { tenderId }: any) =>
      getService().getTenderFollowUps(tenderId),
  },

  Mutation: {
    participateInTender: (_: unknown, { input }: any) =>
      getService().participateInTender(input),

    updateTenderParticipation: (_: unknown, { input }: any) =>
      getService().updateParticipationStatus(input),

    updateVendorTenderFollowUp: (_: unknown, { input }: any) => {
      const { id, ...data } = input;
      return getService().updateFollowUp(id, data);
    },
  },
};

