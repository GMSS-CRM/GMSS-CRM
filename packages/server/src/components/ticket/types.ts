import { Ticket } from '../../entities/Ticket';

export interface ITicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  findByAssignee(userId: string): Promise<Ticket[]>;
  createTicket(data: Partial<Ticket>): Promise<Ticket>;
  updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket>;
  deleteTicket(id: string): Promise<void>;
}

export interface ITicketService {
  getAll(): Promise<Ticket[]>;
  getById(id: string): Promise<Ticket | null>;
  getByAssignee(userId: string): Promise<Ticket[]>;
  create(data: Partial<Ticket>): Promise<Ticket>;
  update(id: string, data: Partial<Ticket>): Promise<Ticket>;
  delete(id: string): Promise<void>;
}
