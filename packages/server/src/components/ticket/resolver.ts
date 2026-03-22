import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITicketService } from './types';

function getService(): ITicketService {
  return getContainer().get<ITicketService>(TYPES.ITicketService);
}

export const ticketResolvers = {
  Query: {
    getTickets: () => getService().getAll(),
    getTicketById: (_: unknown, { id }: { id: string }) =>
      getService().getById(id),
    getTicketsByAssignee: (_: unknown, { userId }: { userId: string }) =>
      getService().getByAssignee(userId),
  },

  Mutation: {
    createTicket: (_: unknown, { input }: { input: Record<string, unknown> }) =>
      getService().create(input as any),

    updateTicket: (_: unknown, { id, input }: { id: string; input: Record<string, unknown> }) =>
      getService().update(id, input as any),

    deleteTicket: async (_: unknown, { id }: { id: string }) => {
      await getService().delete(id);
      return true;
    },
  },

  Ticket: {
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date ? parent.createdDate.toISOString() : parent.createdDate,
    updatedDate: (parent: any) =>
      parent.updatedDate instanceof Date ? parent.updatedDate.toISOString() : parent.updatedDate,
  },
};
