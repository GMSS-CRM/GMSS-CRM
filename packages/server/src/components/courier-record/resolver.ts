import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ICourierRecordService } from './types';

function getService(): ICourierRecordService {
  return getContainer().get<ICourierRecordService>(TYPES.ICourierRecordService);
}

export const courierRecordResolvers = {
  Query: {
    getCourierRecords: () => getService().getAll(),
    getCourierRecordById: (_: unknown, { id }: { id: string }) =>
      getService().getById(id),
    getCourierRecordsByReference: (_: unknown, { referenceId, referenceType }: { referenceId: string; referenceType: string }) =>
      getService().getByReference(referenceId, referenceType),
  },

  Mutation: {
    createCourierRecord: (_: unknown, { input }: { input: Record<string, unknown> }) =>
      getService().create(input as any),

    updateCourierRecord: (_: unknown, { id, input }: { id: string; input: Record<string, unknown> }) =>
      getService().update(id, input as any),

    deleteCourierRecord: async (_: unknown, { id }: { id: string }) => {
      await getService().delete(id);
      return true;
    },
  },

  CourierRecord: {
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date ? parent.createdDate.toISOString() : parent.createdDate,
    updatedDate: (parent: any) =>
      parent.updatedDate instanceof Date ? parent.updatedDate.toISOString() : parent.updatedDate,
    dispatchDate: (parent: any) =>
      parent.dispatchDate instanceof Date ? parent.dispatchDate.toISOString() : parent.dispatchDate,
    receivedDate: (parent: any) =>
      parent.receivedDate instanceof Date ? parent.receivedDate.toISOString() : parent.receivedDate,
  },
};
