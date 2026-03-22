import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { Ticket } from '../../entities/Ticket';
import { ITicketRepository, ITicketService } from './types';

@injectable()
export class TicketService implements ITicketService {
  constructor(
    @inject(TYPES.ITicketRepository)
    private readonly repo: ITicketRepository,
  ) {}

  getAll(): Promise<Ticket[]> {
    return this.repo.findAll();
  }

  getById(id: string): Promise<Ticket | null> {
    return this.repo.findById(id);
  }

  getByAssignee(userId: string): Promise<Ticket[]> {
    return this.repo.findByAssignee(userId);
  }

  create(data: Partial<Ticket>): Promise<Ticket> {
    return this.repo.createTicket(data);
  }

  update(id: string, data: Partial<Ticket>): Promise<Ticket> {
    return this.repo.updateTicket(id, data);
  }

  delete(id: string): Promise<void> {
    return this.repo.deleteTicket(id);
  }
}
