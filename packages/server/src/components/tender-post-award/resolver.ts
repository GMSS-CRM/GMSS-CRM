import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITenderPostAwardService } from './types';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';

function getService(): ITenderPostAwardService {
  return getContainer().get<ITenderPostAwardService>(TYPES.ITenderPostAwardService);
}

export const tenderPostAwardResolvers = {
  Query: {
    getTenderPostAward: async (_: unknown, { tenderId, vendorId }: { tenderId: string; vendorId?: string }) => {
      // Fetch the post-award record (null if doesn't exist)
      const postAward = await getService().get(tenderId);
      
      if (!postAward) {
        // No post-award record exists yet; create one if no vendorId filter
        if (!vendorId) {
          return getService().getOrCreate(tenderId);
        }
        return null;
      }

      // If vendorId is provided, only return if it matches the winning vendor
      if (vendorId && postAward.winningVendorId !== vendorId) {
        return null;
      }

      return postAward;
    },
  },
  Mutation: {
    updateOrderFollowUp: (_: unknown, { input }: { input: { tenderId: string; [key: string]: unknown } }) => {
      const { tenderId, ...data } = input;
      return getService().updateStage(tenderId, PostAwardStage.ORDER_FOLLOWUP, data as any);
    },
    updateOrderProcessing: (_: unknown, { input }: { input: { tenderId: string; [key: string]: unknown } }) => {
      const { tenderId, ...data } = input;
      return getService().updateStage(tenderId, PostAwardStage.ORDER_PROCESSING, data as any);
    },
    updateInspection: (_: unknown, { input }: { input: { tenderId: string; [key: string]: unknown } }) => {
      const { tenderId, ...data } = input;
      return getService().updateStage(tenderId, PostAwardStage.INSPECTION, data as any);
    },
    updateDispatchDelivery: (_: unknown, { input }: { input: { tenderId: string; [key: string]: unknown } }) => {
      const { tenderId, ...data } = input;
      return getService().updateStage(tenderId, PostAwardStage.DISPATCH_DELIVERY, data as any);
    },
    updateWarranty: (_: unknown, { input }: { input: { tenderId: string; [key: string]: unknown } }) => {
      const { tenderId, ...data } = input;
      return getService().updateStage(tenderId, PostAwardStage.WARRANTY, data as any);
    },
    updateBillPayment: (_: unknown, { input }: { input: { tenderId: string; [key: string]: unknown } }) => {
      const { tenderId, ...data } = input;
      return getService().updateStage(tenderId, PostAwardStage.BILL_PAYMENT, data as any);
    },
    updateLoaProcessing: (_: unknown, { input }: { input: { tenderId: string; [key: string]: unknown } }) => {
      const { tenderId, ...data } = input;
      return getService().updateStage(tenderId, PostAwardStage.LOA_PROCESSING, data as any);
    },
    updateSdReturn: (_: unknown, { input }: { input: { tenderId: string; [key: string]: unknown } }) => {
      const { tenderId, ...data } = input;
      return getService().updateStage(tenderId, PostAwardStage.SD_RETURN, data as any);
    },
    advancePostAwardStage: (_: unknown, { tenderId }: { tenderId: string }) =>
      getService().advanceStage(tenderId),
    revertPostAwardStage: (_: unknown, { tenderId }: { tenderId: string }) =>
      getService().revertStage(tenderId),
    markVendorAsWinner: (_: unknown, { tenderId, vendorId }: { tenderId: string; vendorId: string }) =>
      getService().setWinningVendor(tenderId, vendorId),
  },
};
