"""
Content extraction service for URLs and documents.
"""
import io
from typing import List
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup
import PyPDF2
from config import MAX_CONTENT_LENGTH, REQUEST_TIMEOUT


class ContentExtractor:
    """Service for extracting text content from various sources."""
    
    def __init__(self):
        self.timeout = REQUEST_TIMEOUT
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def extract_from_url(self, url: str) -> str:
        """Extract text content from a URL (supports HTML and PDF)."""
        try:
            # Validate URL
            parsed_url = urlparse(url)
            if not parsed_url.scheme or not parsed_url.netloc:
                return ""
            
            response = requests.get(url, timeout=self.timeout, headers=self.headers)
            response.raise_for_status()
            
            content_type = response.headers.get('content-type', '').lower()
            
            if 'pdf' in content_type or url.lower().endswith('.pdf'):
                return self._extract_from_pdf(response.content)
            else:
                return self._extract_from_html(response.text)
                
        except Exception as e:
            print(f"Error extracting content from {url}: {e}")
            return ""
    
    def extract_from_urls(self, urls: List[str]) -> str:
        """Extract content from multiple URLs and combine."""
        if not urls:
            return ""
        
        all_content = []
        for url in urls:
            if url.strip():
                content = self.extract_from_url(url.strip())
                if content:
                    all_content.append(f"Content from {url}:\n{content}\n")
        
        return "\n".join(all_content)
    
    def _extract_from_html(self, html_content: str) -> str:
        """Extract text content from HTML."""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            for script in soup(["script", "style"]):
                script.decompose()
            
            text = soup.get_text()
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            return text[:MAX_CONTENT_LENGTH] if len(text) > MAX_CONTENT_LENGTH else text
            
        except Exception as e:
            print(f"Error parsing HTML: {e}")
            return ""
    
    def _extract_from_pdf(self, pdf_content: bytes) -> str:
        """Extract text content from PDF."""
        try:
            pdf_file = io.BytesIO(pdf_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text[:MAX_CONTENT_LENGTH] if len(text) > MAX_CONTENT_LENGTH else text
            
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return ""
