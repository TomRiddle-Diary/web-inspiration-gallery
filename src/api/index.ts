const API_BASE_URL = 'http://localhost:3001/api';

export interface WebsiteData {
  id: string;
  url: string;
  title: string;
  heroImage: string;
  colors: string[];
  fonts: string[];
  savedAt: string;
  category?: string;
}

export const api = {
  // Get all saved websites
  async getAllWebsites(): Promise<WebsiteData[]> {
    const response = await fetch(`${API_BASE_URL}/websites`);
    if (!response.ok) {
      throw new Error('Failed to fetch websites');
    }
    return response.json();
  },

  // Get single website by ID
  async getWebsiteById(id: string): Promise<WebsiteData> {
    const response = await fetch(`${API_BASE_URL}/websites/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch website');
    }
    return response.json();
  },

  // Save a new website
  async saveWebsite(url: string): Promise<WebsiteData> {
    const response = await fetch(`${API_BASE_URL}/websites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save website');
    }
    
    return response.json();
  },

  // Delete a website
  async deleteWebsite(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/websites/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete website');
    }
  },

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};
