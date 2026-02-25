import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorProposalService } from './types';
import { IVendorProposalRepository } from './types';


const getService = () => {
  const container = getContainer();
  return container.get<IVendorProposalService>(
    TYPES.IVendorProposalService
  );
};

export const vendorProposalResolvers = {
  Query: {
    getVendorProposals: async (_: unknown, { vendorId }: any) => {
      const container = getContainer();
     const repository = container.get<IVendorProposalRepository>(
  TYPES.IVendorProposalRepository
);

      return repository.findByVendorId(vendorId);
    },
  },

  Mutation: {
    createVendorProposal: (_: unknown, { input }: any) =>
      getService().createProposal(input),

    updateVendorProposalStatus: (_: unknown, { input }: any) =>
      getService().updateProposalStatus(input),
  },
};
