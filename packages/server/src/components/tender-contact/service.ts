import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { TenderContact } from '../../entities/TenderContact';
import { ITenderContactRepository, ITenderContactService } from './types';

@injectable()
export class TenderContactService implements ITenderContactService {
  constructor(
    @inject(TYPES.ITenderContactRepository)
    private readonly repo: ITenderContactRepository,
  ) {}

  getByTenderId(tenderId: string): Promise<TenderContact[]> {
    return this.repo.findByTenderId(tenderId);
  }

  create(data: Partial<TenderContact>): Promise<TenderContact> {
    return this.repo.createContact(data);
  }

  update(id: string, data: Partial<TenderContact>): Promise<TenderContact> {
    return this.repo.updateContact(id, data);
  }

  delete(id: string): Promise<void> {
    return this.repo.deleteContact(id);
  }
}
