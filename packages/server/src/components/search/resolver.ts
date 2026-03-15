import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import type { ITenderRepository } from '../tender/types';
import type { IVendorRepository } from '../vendor/types';

const getTenderRepository = () => {
  const container = getContainer();
  return container.get<ITenderRepository>(TYPES.ITenderRepository);
};

const getVendorRepository = () => {
  const container = getContainer();
  return container.get<IVendorRepository>(TYPES.IVendorRepository);
};

export const searchResolvers = {
  Query: {
    searchTenders: async (_: unknown, { searchTerm }: { searchTerm: string }) => {
      if (!searchTerm || searchTerm.length < 2) {
        return [];
      }

      const tenderRepo = getTenderRepository();
      const query = tenderRepo
        .createQueryBuilder('tender')
        .leftJoinAndSelect('tender.tags', 'tenderTag')
        .leftJoinAndSelect('tenderTag.tag', 'tag')
        .where('tender.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
        .orWhere('tender.referenceNumber ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
        .orderBy('tender.createdDate', 'DESC')
        .limit(20);

      return query.getMany();
    },

    searchVendors: async (_: unknown, { searchTerm }: { searchTerm: string }) => {
      if (!searchTerm || searchTerm.length < 2) {
        return [];
      }

      const vendorRepo = getVendorRepository();
      const query = vendorRepo
        .createQueryBuilder('vendor')
        .leftJoinAndSelect('vendor.contactPersons', 'contactPerson')
        .leftJoinAndSelect('vendor.tags', 'vendorTag')
        .leftJoinAndSelect('vendorTag.tag', 'tag')
        .where('vendor.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
        .orderBy('vendor.createdDate', 'DESC')
        .limit(20);

      return query.getMany();
    },
  },
};
