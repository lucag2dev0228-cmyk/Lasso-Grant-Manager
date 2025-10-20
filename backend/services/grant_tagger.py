"""
Grant tagging service using LLM and keyword-based approaches.
"""
from typing import List, Optional
from openai import OpenAI
from config import TAGS, OPENAI_API_KEY
from services.content_extractor import ContentExtractor


class GrantTagger:
    """Service for tagging grants using LLM and keyword-based approaches."""
    
    def __init__(self, openai_client: Optional[OpenAI] = None):
        self.openai_client = openai_client
        self.content_extractor = ContentExtractor()
    
    def tag_grant(self, grant_name: str, grant_description: str, 
                  website_urls: List[str] = None, document_urls: List[str] = None) -> List[str]:
        """Tag a grant using the best available method."""
        try:
            if self.openai_client:
                return self._tag_with_llm(grant_name, grant_description, website_urls, document_urls)
            else:
                return self._tag_with_keywords(grant_name, grant_description, website_urls, document_urls)
        except Exception as e:
            print(f"Error in grant tagging: {e}")
            return self._tag_with_keywords(grant_name, grant_description, website_urls, document_urls)
    
    def _tag_with_llm(self, grant_name: str, grant_description: str, 
                      website_urls: List[str] = None, document_urls: List[str] = None) -> List[str]:
        """Tag grant using OpenAI LLM."""
        try:
            extracted_content = ""
            if website_urls or document_urls:
                all_urls = (website_urls or []) + (document_urls or [])
                extracted_content = self.content_extractor.extract_from_urls(all_urls)
            
            url_context = ""
            if website_urls:
                url_context += f"\nWebsite URLs: {', '.join(website_urls)}"
            if document_urls:
                url_context += f"\nDocument URLs: {', '.join(document_urls)}"
            
            content_context = ""
            if extracted_content:
                content_context = f"\n\nAdditional context from URLs:\n{extracted_content}"
            
            prompt = f"""
            Analyze the following grant and assign relevant tags from this predefined list:
            {', '.join(TAGS)}
            
            Grant Name: {grant_name}
            Grant Description: {grant_description}{url_context}{content_context}
            
            Return only the most relevant tags (3-7 tags maximum) as a comma-separated list.
            Only use tags from the predefined list above.
            Use the additional context from URLs to improve tagging accuracy.
            Focus on the most specific and relevant tags for this grant.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.2
            )
            
            tags_text = response.choices[0].message.content.strip()
            tags = [tag.strip().lower() for tag in tags_text.split(',')]
            
            valid_tags = [tag for tag in tags if tag in TAGS]
            
            return valid_tags if valid_tags else ["general"]
            
        except Exception as e:
            print(f"Error in LLM tagging: {e}")
            return self._tag_with_keywords(grant_name, grant_description, website_urls, document_urls)
    
    def _tag_with_keywords(self, grant_name: str, grant_description: str, 
                          website_urls: List[str] = None, document_urls: List[str] = None) -> List[str]:
        """Tag grant using keyword-based matching."""
        text = f"{grant_name} {grant_description}".lower()
        
        if website_urls:
            text += " " + " ".join(website_urls).lower()
        if document_urls:
            text += " " + " ".join(document_urls).lower()
        
        if website_urls or document_urls:
            all_urls = (website_urls or []) + (document_urls or [])
            extracted_content = self.content_extractor.extract_from_urls(all_urls)
            if extracted_content:
                text += " " + extracted_content.lower()
        
        matched_tags = []
        for tag in TAGS:
            if tag.lower() in text:
                matched_tags.append(tag)
        
        return matched_tags if matched_tags else ["general"]
