"""
Data models for the Lasso Grant Manager application.
"""
from typing import List, Dict, Any


class Grant:
    """Represents a grant with all its associated data."""
    
    def __init__(self, grant_name: str, grant_description: str, 
                 website_urls: List[str] = None, document_urls: List[str] = None, 
                 tags: List[str] = None):
        self.grant_name = grant_name
        self.grant_description = grant_description
        self.website_urls = website_urls or []
        self.document_urls = document_urls or []
        self.tags = tags or []
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert grant to dictionary for JSON serialization."""
        return {
            'grant_name': self.grant_name,
            'grant_description': self.grant_description,
            'website_urls': self.website_urls,
            'document_urls': self.document_urls,
            'tags': self.tags
        }
