import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITenderActivityLogService } from './types';

function getService(): ITenderActivityLogService {
  return getContainer().get<ITenderActivityLogService>(TYPES.ITenderActivityLogService);
}

export const tenderActivityLogResolvers = {
  Query: {
    getTenderActivityLogs: (_: unknown, { tenderId }: { tenderId: string }) =>
      getService().getByTenderId(tenderId),
  },

  Mutation: {
    logTenderActivity: (
      _: unknown,
      { input }: { input: { tenderId: string; action: string; description: string; metadata?: string } },
    ) => {
      const metadata = input.metadata ? JSON.parse(input.metadata) : undefined;
      return getService().log(input.tenderId, input.action, input.description, undefined, metadata);
    },
  },

  TenderActivityLog: {
    metadata: (parent: any) =>
      parent.metadata ? JSON.stringify(parent.metadata) : null,
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date
        ? parent.createdDate.toISOString()
        : parent.createdDate,
  },
};
