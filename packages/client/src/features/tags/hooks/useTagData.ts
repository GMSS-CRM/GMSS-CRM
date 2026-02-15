import { useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { 
  dummyTags, 
  dummyTagVendors, 
  simulateDelay 
} from '../data/dummyData';
import type { CreateTagPayload, TagVendorDisplay, TagWithVendorCount, UpdateTagPayload } from '../types/tagTypes';


// Flag to switch between dummy and real API
const USE_DUMMY_DATA = true;

export function useTagsData() {
  const [tags, setTags] = useState<TagWithVendorCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_DUMMY_DATA) {
        await simulateDelay(600);
        setTags(dummyTags);
      } else {
        // TODO: Replace with real API call
        // const { data } = await client.query({ query: TAGS_QUERY });
        // setTags(data.searchTags);
      }
    } catch (err) {
      setError('Failed to fetch tags');
      message.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Stats calculation
  const stats = useMemo(() => ({
    totalTags: tags.length,
    totalAssignments: tags.reduce((sum, tag) => sum + tag.vendorCount, 0),
    totalEmailEnabled: tags.reduce((sum, tag) => sum + tag.enabledMailCount, 0),
  }), [tags]);

  return { tags, loading, error, refetch: fetchTags, stats };
}

export function useTagVendors(tagId: string | null) {
  const [vendors, setVendors] = useState<TagVendorDisplay[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVendors = useCallback(async () => {
    if (!tagId) {
      setVendors([]);
      return;
    }
    
    setLoading(true);
    try {
      if (USE_DUMMY_DATA) {
        await simulateDelay(400);
        setVendors(dummyTagVendors[tagId] || []);
      } else {
        // TODO: Replace with real API call
      }
    } catch (err) {
      message.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [tagId]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const enabledCount = vendors.filter(v => v.enableMail).length;

  return { vendors, loading, refetch: fetchVendors, enabledCount };
}

export function useTagMutations(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const createTag = useCallback(async (input: CreateTagPayload) => {
    setLoading(true);
    try {
      if (USE_DUMMY_DATA) {
        await simulateDelay(500);
        // Simulate validation
        if (dummyTags.some(t => t.name.toLowerCase() === input.name.toLowerCase())) {
          throw new Error('Tag with this name already exists');
        }
        message.success(`Tag "${input.name}" created successfully`);
        onSuccess?.();
        return true;
      } else {
        // TODO: Replace with real API call
      }
    } catch (err: any) {
      message.error(err.message || 'Failed to create tag');
      return false;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  const updateTag = useCallback(async (_id: string, _input: UpdateTagPayload) => {
    setLoading(true);
    try {
      if (USE_DUMMY_DATA) {
        await simulateDelay(500);
        message.success('Tag updated successfully');
        onSuccess?.();
        return true;
      } else {
        // TODO: Replace with real API call
      }
    } catch (err) {
      message.error('Failed to update tag');
      return false;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  const deleteTag = useCallback(async (_id: string, name: string) => {
    setLoading(true);
    try {
      if (USE_DUMMY_DATA) {
        await simulateDelay(500);
        message.success(`Tag "${name}" deleted successfully`);
        onSuccess?.();
        return true;
      } else {
        // TODO: Replace with real API call
      }
    } catch (err) {
      message.error('Failed to delete tag');
      return false;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  const deleteTags = useCallback(async (ids: string[]) => {
    setLoading(true);
    try {
      if (USE_DUMMY_DATA) {
        await simulateDelay(500);
        message.success(`${ids.length} tags deleted successfully`);
        onSuccess?.();
        return true;
      } else {
        // TODO: Replace with real API call
      }
    } catch (err) {
      message.error('Failed to delete tags');
      return false;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  const toggleVendorEmail = useCallback(async (
    _vendorTagId: string,
    vendorName: string,
    enableMail: boolean
  ) => {
    try {
      if (USE_DUMMY_DATA) {
        await simulateDelay(300);
        message.success(
          enableMail 
            ? `Email enabled for ${vendorName}` 
            : `Email disabled for ${vendorName}`
        );
        return true;
      } else {
        // TODO: Replace with real API call
      }
    } catch (err) {
      message.error('Failed to update email preference');
      return false;
    }
  }, []);

  return { 
    createTag, 
    updateTag, 
    deleteTag, 
    deleteTags, 
    toggleVendorEmail,
    loading 
  };
}
