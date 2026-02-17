import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorWorkflowService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorWorkflowService>(
    TYPES.IVendorWorkflowService
  );
};

export const vendorWorkflowResolvers = {
  Query: {
    getVendorWorkflow: (_: unknown, { vendorId }: any) =>
      getService().getWorkflow(vendorId),
  },

  Mutation: {
    changeVendorStatus: (_: unknown, { input }: any) =>
      getService().changeStatus(
        input.vendorId,
        input.newStatus,
        input.remarks
      ),
  },
};
