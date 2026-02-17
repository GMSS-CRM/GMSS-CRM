import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorApprovalService } from './types';
import { IVendorApprovalRepository } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorApprovalService>(
    TYPES.IVendorApprovalService
  );
};

export const vendorApprovalResolvers = {
  Query: {
  getVendorApprovals: async (_: unknown, { vendorId }: any) => {
    const container = getContainer();
    const repository = container.get<IVendorApprovalRepository>(
  TYPES.IVendorApprovalRepository
);
    return repository.findByVendorId(vendorId);
  },
},


  Mutation: {
    requestVendorApproval: (_: unknown, { input }: any) =>
      getService().requestApproval(input.vendorId),

    decideVendorApproval: (_: unknown, { input }: any) =>
      getService().decideApproval(
        input.approvalId,
        input.status,
        input.remarks
      ),
  },
};
