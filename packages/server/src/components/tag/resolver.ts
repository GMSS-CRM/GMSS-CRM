import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { ITagService } from './types';

const getService = () => {
  const container = getContainer();
  return container.get<ITagService>(TYPES.ITagService);
};

export const tagResolvers = {
  Tag: {
    vendorCount: (parent: any) => getService().getVendorCount(parent.id),
    enabledMailCount: (parent: any) => getService().getEnabledMailCount(parent.id),
    tenderCount: (parent: any) => getService().getTenderCount(parent.id),
  },

  Query: {
    getTagById: (_: unknown, { id }: any) => getService().getTagById(id),
    searchTags: (_: unknown, { searchInput }: any) => getService().searchTag(searchInput as any),
    getTendersByTag: (_: unknown, { tagId }: any) => getService().getTendersByTag(tagId),
  },

  Mutation: {
    createTag: (_: unknown, { input }: any, context: any) =>
      getService().createTag(input as any, { email: context?.user?.email }),

    updateTag: (_: unknown, { id, input }: any, context: any) =>
      getService().updateTag(id, input as any),

    deleteTag: (_: unknown, { id }: any) => getService().deleteTag(id),

    deleteTags: (_: unknown, { ids }: any) => getService().deleteTags(ids),
  },
};
