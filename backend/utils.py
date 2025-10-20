"""
Utility functions for the Lasso Grant Manager application.
"""
from typing import List, Dict, Any, Optional
from flask import jsonify


def validate_grants_list(data: List[Dict[str, Any]]) -> Optional[str]:
    """Validate list of grants data."""
    if not isinstance(data, list):
        return "Data must be an array of grants"
    
    if not data:
        return "At least one grant is required"
    
    for i, grant in enumerate(data):
        if not isinstance(grant, dict) or 'grant_name' not in grant or 'grant_description' not in grant:
            return f"Grant {i + 1}: Each grant must have 'grant_name' and 'grant_description' fields."
    
    return None


def sanitize_grant_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitize and normalize grant data."""
    return {
        'grant_name': data['grant_name'].strip(),
        'grant_description': data['grant_description'].strip(),
        'website_urls': [url.strip() for url in data.get('website_urls', []) if url.strip()],
        'document_urls': [url.strip() for url in data.get('document_urls', []) if url.strip()]
    }
