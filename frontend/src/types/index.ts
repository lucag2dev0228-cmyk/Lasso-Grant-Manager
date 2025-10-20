export interface Grant {
  grant_name: string;
  grant_description: string;
  website_urls?: string[];
  document_urls?: string[];
  tags: string[];
}

export interface GrantFormData {
  grant_name: string;
  grant_description: string;
  website_urls: string[];
  document_urls: string[];
}

export interface MessageState {
  type: 'success' | 'error';
  text: string;
}
