import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITenderPostAwardService } from './types';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';

function getService(): ITenderPostAwardService {
  return getContainer().get<ITenderPostAwardService>(TYPES.ITenderPostAwardService);
}

export const tenderPostAwardResolvers = {
  Query: {
    getTenderPostAward: (_: unknown, { tenderId }: { tenderId: string }) =>
      getService().getOrCreate(tenderId),
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
    advancePostAwardStage: (_: unknown, { tenderId }: { tenderId: string }) =>
      getService().advanceStage(tenderId),
  },
};
