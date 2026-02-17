import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorCommissionService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorCommissionService>(
    TYPES.IVendorCommissionService
  );
};

export const vendorCommissionResolvers = {
  Query: {
    calculateVendorCommission: (_: unknown, args: any) =>
      getService().calculateCommission(
        args.baseAmount,
        args.commissionType,
        args.commissionValue,
        args.gstApplicable
      ),
  },
};
