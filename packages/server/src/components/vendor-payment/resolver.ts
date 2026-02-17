import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { IVendorPaymentService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<IVendorPaymentService>(
    TYPES.IVendorPaymentService
  );
};

export const vendorPaymentResolvers = {
  Query: {
    generateVendorPaymentSchedule: (_: unknown, args: any) =>
      getService().generateSchedule(
        args.totalAmount,
        args.frequency,
        args.gstApplicable,
        new Date(args.startDate)
      ),
  },
};
