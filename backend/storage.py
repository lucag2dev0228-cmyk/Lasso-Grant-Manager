"""
Storage management for grants data.
"""
from typing import List
from models import Grant


class GrantStorage:
    """In-memory storage for grants."""
    
    def __init__(self):
        self._grants: List[Grant] = []
    
    def add_grant(self, grant: Grant) -> Grant:
        """Add a new grant to storage."""
        self._grants.append(grant)
        return grant
    
    def get_all_grants(self) -> List[Grant]:
        """Get all grants from storage."""
        return self._grants.copy()
    
    def get_grants_by_tag(self, tag: str) -> List[Grant]:
        """Get grants filtered by tag."""
        tag_lower = tag.lower()
        return [
            grant for grant in self._grants 
            if any(tag_lower in grant_tag.lower() for grant_tag in grant.tags)
        ]
    
    def get_all_tags(self) -> List[str]:
        """Get all unique tags from all grants."""
        tag_set = set()
        for grant in self._grants:
            tag_set.update(grant.tags)
        return sorted(list(tag_set))

grant_storage = GrantStorage()
