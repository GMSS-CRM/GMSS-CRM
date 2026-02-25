import { useCallback, useMemo } from 'react';
import { message } from 'antd';
import {
  useSearchTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
  useDeleteTags,
  useUpdateVendorTagEmail,
} from '../services/tags.service';
import type { CreateTagPayload } from '../types/tagTypes';
import type { Tag, UpdateTagInput } from '@gmss/types';

export function useTagsData() {
  const { data, loading, error, refetch } = useSearchTags();

  const tags = useMemo(() => {
    const raw = data?.searchTags ?? [];
    return raw.map((t: Tag) => ({
      id: t.id,
      name: t.name,
      createdBy: t.createdBy ?? '',
      updatedBy: t.updatedBy ?? undefined,
      createdDate: t.createdDate ?? '',
      updatedDate: t.updatedDate ?? '',
      vendorCount: t.vendorCount ?? 0,
      enabledMailCount: t.enabledMailCount ?? 0,
      tenderCount: t.tenderCount ?? 0,
    }));
  }, [data]);

  const stats = useMemo(() => ({
    totalTags: tags.length,
    totalAssignments: tags.reduce((sum, tag) => sum + tag.vendorCount, 0),
    totalEmailEnabled: tags.reduce((sum, tag) => sum + tag.enabledMailCount, 0),
  }), [tags]);

  return {
    tags,
    loading,
    error: error?.message ?? null,
    refetch,
    stats,
  };
}

export function useTagMutations(onSuccess?: () => void) {
  const [createTagMutation, { loading: createLoading }] = useCreateTag();
  const [updateTagMutation, { loading: updateLoading }] = useUpdateTag();
  const [deleteTagMutation, { loading: deleteLoading }] = useDeleteTag();
  const [deleteTagsMutation, { loading: deleteBulkLoading }] = useDeleteTags();
  const [updateEmailMutation] = useUpdateVendorTagEmail();

  const loading = createLoading || updateLoading || deleteLoading || deleteBulkLoading;

  const createTag = useCallback(async (input: CreateTagPayload) => {
    try {
      await createTagMutation({ variables: { input: { name: input.name } } });
      message.success(`Tag "${input.name}" created successfully`);
      onSuccess?.();
      return true;
    } catch (err: any) {
      message.error(err.message || 'Failed to create tag');
      return false;
    }
  }, [createTagMutation, onSuccess]);

  const updateTag = useCallback(async (id: string, input: UpdateTagInput) => {
    try {
      await updateTagMutation({ variables: { id, input } });
      message.success('Tag updated successfully');
      onSuccess?.();
      return true;
    } catch (err: any) {
      message.error(err.message || 'Failed to update tag');
      return false;
    }
  }, [updateTagMutation, onSuccess]);

  const deleteTag = useCallback(async (id: string, name: string) => {
    try {
      await deleteTagMutation({ variables: { id } });
      message.success(`Tag "${name}" deleted successfully`);
      onSuccess?.();
      return true;
    } catch (err: any) {
      message.error(err.message || 'Failed to delete tag');
      return false;
    }
  }, [deleteTagMutation, onSuccess]);

  const deleteTags = useCallback(async (ids: string[]) => {
    try {
      await deleteTagsMutation({ variables: { ids } });
      message.success(`${ids.length} tags deleted successfully`);
      onSuccess?.();
      return true;
    } catch (err: any) {
      message.error(err.message || 'Failed to delete tags');
      return false;
    }
  }, [deleteTagsMutation, onSuccess]);

  const toggleVendorEmail = useCallback(async (
    vendorTagId: string,
    vendorName: string,
    enableMail: boolean,
  ) => {
    try {
      await updateEmailMutation({ variables: { id: vendorTagId, enableMail } });
      message.success(
        enableMail
          ? `Email enabled for ${vendorName}`
          : `Email disabled for ${vendorName}`,
      );
      return true;
    } catch (err: any) {
      message.error(err.message || 'Failed to update email preference');
      return false;
    }
  }, [updateEmailMutation]);

  return {
    createTag,
    updateTag,
    deleteTag,
    deleteTags,
    toggleVendorEmail,
    loading,
  };
}
