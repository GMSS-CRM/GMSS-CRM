import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Ticket } from '../../entities/Ticket';
import { ITicketRepository } from './types';

@injectable()
export class TicketRepository
  extends Repository<Ticket>
  implements ITicketRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(Ticket, db.manager);
  }

  findAll(): Promise<Ticket[]> {
    return this.find({ order: { createdDate: 'DESC' } });
  }

  findById(id: string): Promise<Ticket | null> {
    return this.findOneBy({ id });
  }

  findByAssignee(userId: string): Promise<Ticket[]> {
    return this.find({
      where: { assignedTo: userId },
      order: { createdDate: 'DESC' },
    });
  }

  async createTicket(data: Partial<Ticket>): Promise<Ticket> {
    return this.save(this.create(data));
  }

  async updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket> {
    await this.update(id, data);
    return this.findOneByOrFail({ id });
  }

  async deleteTicket(id: string): Promise<void> {
    await this.delete(id);
  }
}
