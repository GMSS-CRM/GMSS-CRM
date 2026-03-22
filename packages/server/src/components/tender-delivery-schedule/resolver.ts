import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITenderDeliveryScheduleService } from './types';

function getService(): ITenderDeliveryScheduleService {
  return getContainer().get<ITenderDeliveryScheduleService>(TYPES.ITenderDeliveryScheduleService);
}

export const tenderDeliveryScheduleResolvers = {
  Query: {
    getDeliverySchedules: (_: unknown, { postAwardId }: { postAwardId: string }) =>
      getService().getByPostAward(postAwardId),
  },

  Mutation: {
    createDeliverySchedule: (_: unknown, { input }: { input: Record<string, unknown> }) =>
      getService().create(input as any),

    updateDeliverySchedule: (_: unknown, { id, input }: { id: string; input: Record<string, unknown> }) =>
      getService().update(id, input as any),

    deleteDeliverySchedule: async (_: unknown, { id }: { id: string }) => {
      await getService().delete(id);
      return true;
    },
  },

  TenderDeliverySchedule: {
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date ? parent.createdDate.toISOString() : parent.createdDate,
    updatedDate: (parent: any) =>
      parent.updatedDate instanceof Date ? parent.updatedDate.toISOString() : parent.updatedDate,
    scheduledDate: (parent: any) =>
      parent.scheduledDate instanceof Date ? parent.scheduledDate.toISOString() : parent.scheduledDate,
    confirmedDate: (parent: any) =>
      parent.confirmedDate instanceof Date ? parent.confirmedDate.toISOString() : parent.confirmedDate,
  },
};
