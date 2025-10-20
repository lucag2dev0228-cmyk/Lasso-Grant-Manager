import { useState, useMemo } from 'react';
import { Grant } from '../types';

export const useFilters = (grants: Grant[]) => {
  const [selectedTag, setSelectedTag] = useState<string>('');

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    grants.forEach(grant => {
      grant.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [grants]);

  const filteredGrants = useMemo(() => {
    if (!selectedTag) return grants;
    
    return grants.filter(grant => 
      grant.tags.some(tag => 
        tag.toLowerCase().includes(selectedTag.toLowerCase())
      )
    );
  }, [grants, selectedTag]);

  return {
    selectedTag,
    allTags,
    filteredGrants,
    setSelectedTag,
  };
};
