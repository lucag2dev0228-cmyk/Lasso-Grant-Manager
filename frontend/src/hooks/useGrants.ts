import { useState, useEffect, useCallback } from 'react';
import { Grant, MessageState } from '../types';
import { addGrants as apiAddGrants, getGrants as apiGetGrants, getTags as apiGetTags } from '../services/api';

export const useGrants = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const fetchGrants = useCallback(async (tag?: string) => {
    try {
      setLoading(true);
      const response = await apiGetGrants(tag);
      setGrants(response.grants);
    } catch (error) {
      console.error('Error fetching grants:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to fetch grants'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const response = await apiGetTags();
      setAvailableTags(response.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to fetch tags'
      });
    }
  }, []);

  const addGrants = useCallback(async (newGrants: Omit<Grant, 'tags'>[]) => {
    try {
      setLoading(true);
      const response = await apiAddGrants(newGrants);
      setGrants(prevGrants => [...prevGrants, ...response.grants]);
      setMessage({
        type: 'success',
        text: response.message || 'Grants added successfully'
      });
      return response.grants;
    } catch (error) {
      console.error('Error adding grants:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to add grants'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  useEffect(() => {
    fetchGrants();
    fetchTags();
  }, [fetchGrants, fetchTags]);

  return {
    grants,
    availableTags,
    loading,
    message,
    fetchGrants,
    addGrants,
    clearMessage,
  };
};
