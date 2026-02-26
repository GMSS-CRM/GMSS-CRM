import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorMdRequestService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorMdRequestService>(TYPES.IVendorMdRequestService);
};

export const vendorMdRequestResolvers = {
  Query: {
    getPendingMdRequests: () => getService().getPendingRequests(),
    getResolvedMdRequests: () => getService().getResolvedRequests(),
    getMdRequestsByVendor: (_: unknown, { vendorId }: any) =>
      getService().getMdRequestsByVendor(vendorId),
    getActivePendingRequest: (_: unknown, { vendorId }: any) =>
      getService().getActivePendingRequest(vendorId),
  },

  Mutation: {
    createMdRequest: (_: unknown, { input }: any) =>
      getService().createMdRequest(input),
    resolveMdRequest: (_: unknown, { input }: any) =>
      getService().resolveMdRequest(input),
  },

  VendorMdRequest: {
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date
        ? parent.createdDate.toISOString()
        : parent.createdDate ?? null,
    updatedDate: (parent: any) =>
      parent.updatedDate instanceof Date
        ? parent.updatedDate.toISOString()
        : parent.updatedDate ?? null,
  },
};
