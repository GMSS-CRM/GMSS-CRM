import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITagAutoMailRestrictionService } from './types';

function getService(): ITagAutoMailRestrictionService {
  return getContainer().get<ITagAutoMailRestrictionService>(TYPES.ITagAutoMailRestrictionService);
}

export const tagAutoMailRestrictionResolvers = {
  Query: {
    getAutoMailRestrictions: (_: unknown, { tagId }: { tagId: string }) =>
      getService().getByTag(tagId),
    getAutoMailRestrictionsByVendor: (_: unknown, { vendorId }: { vendorId: string }) =>
      getService().getByVendor(vendorId),
  },

  Mutation: {
    addAutoMailRestriction: (_: unknown, { tagId, vendorId }: { tagId: string; vendorId: string }) =>
      getService().create(tagId, vendorId),

    removeAutoMailRestriction: async (_: unknown, { id }: { id: string }) => {
      await getService().delete(id);
      return true;
    },

    removeAutoMailRestrictionByTagAndVendor: async (
      _: unknown,
      { tagId, vendorId }: { tagId: string; vendorId: string },
    ) => {
      await getService().deleteByTagAndVendor(tagId, vendorId);
      return true;
    },
  },

  TagAutoMailRestriction: {
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date ? parent.createdDate.toISOString() : parent.createdDate,
  },
};
