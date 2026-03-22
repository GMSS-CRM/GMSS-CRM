import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import type { ITenderRepository } from '../tender/types';
import { DataSource } from 'typeorm';
import { Ticket } from '../../entities/Ticket';

const getTenderRepository = () => {
  const container = getContainer();
  return container.get<ITenderRepository>(TYPES.ITenderRepository);
};

const getDb = () => getContainer().get<DataSource>(TYPES.DbContext);

export const searchResolvers = {
  Query: {
    searchTenders: async (_: unknown, { searchTerm, includeExpired }: { searchTerm: string; includeExpired?: boolean }) => {
      if (!searchTerm || searchTerm.length < 2) {
        return [];
      }

      const tenderRepo = getTenderRepository();
      const query = tenderRepo
        .createQueryBuilder('tender')
        .leftJoinAndSelect('tender.tags', 'tenderTag')
        .leftJoinAndSelect('tenderTag.tag', 'tag')
        .leftJoinAndSelect('tender.documents', 'documents')
        .where(
          '(tender.name ILIKE :searchTerm OR tender.referenceNumber ILIKE :searchTerm OR tender.description ILIKE :searchTerm OR tender.issuingDepartment ILIKE :searchTerm)',
          { searchTerm: `%${searchTerm}%` },
        );

      if (!includeExpired) {
        query.andWhere('(tender.submissionDeadline IS NULL OR tender.submissionDeadline > NOW())');
      }

      query.orderBy('tender.createdDate', 'DESC').limit(20);

      return query.getMany();
    },

    searchTickets: async (_: unknown, { searchTerm }: { searchTerm: string }) => {
      if (!searchTerm || searchTerm.length < 2) return [];

      return getDb()
        .getRepository(Ticket)
        .createQueryBuilder('t')
        .where('t.title ILIKE :term OR t.description ILIKE :term', { term: `%${searchTerm}%` })
        .orderBy('t.createdDate', 'DESC')
        .limit(10)
        .getMany();
    },
  },
};
