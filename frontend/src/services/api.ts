import { Grant } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function addGrants(grants: Omit<Grant, 'tags'>[]): Promise<{ message: string; grants: Grant[] }> {
  return request<{ message: string; grants: Grant[] }>('/grants', {
    method: 'POST',
    body: JSON.stringify(grants),
  });
}

export async function getGrants(tag?: string): Promise<{ grants: Grant[] }> {
  const endpoint = tag ? `/grants?tag=${encodeURIComponent(tag)}` : '/grants';
  return request<{ grants: Grant[] }>(endpoint);
}

export async function getTags(): Promise<{ tags: string[]; used_tags: string[] }> {
  return request<{ tags: string[]; used_tags: string[] }>('/tags');
}
