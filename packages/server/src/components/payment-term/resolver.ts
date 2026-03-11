import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IPaymentTermService } from './service';
import { IPaymentTermRepository } from './repository';

const getService = () => {
  const container = getContainer();
  return container.get<IPaymentTermService>(TYPES.IPaymentTermService);
};

const getRepository = () => {
  const container = getContainer();
  return container.get<IPaymentTermRepository>(TYPES.IPaymentTermRepository);
};

export const paymentTermResolvers = {
  Query: {
    getPaymentTermsByVendor: async (_: unknown, { vendorId }: any) => {
      return getService().getPaymentTermsByVendor(vendorId);
    },
  },

  Mutation: {
    createPaymentTerm: async (_: unknown, { input }: any) => {
      return getService().createPaymentTerm(input);
    },

    updatePaymentTerm: async (_: unknown, { input }: any) => {
      return getService().updatePaymentTerm(input);
    },

    deletePaymentTerm: async (_: unknown, { id }: any) => {
      return getService().deletePaymentTerm(id);
    },
  },
};
