// API Base URL - automatically detects environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.origin) || 
  'http://localhost:3001';

const API_ENDPOINT = `${API_BASE_URL}/api`;

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
}

export interface WebsiteData {
  id: string;
  url: string;
  title: string;
  heroImage: string;
  colors: string[];
  fonts: string[];
  savedAt: string;
  category?: string;
  projectId?: string;
}

export const api = {
  // Get all saved websites
  async getAllWebsites(): Promise<WebsiteData[]> {
    const response = await fetch(`${API_ENDPOINT}/websites`);
    if (!response.ok) {
      throw new Error('Failed to fetch websites');
    }
    return response.json();
  },

  // Get single website by ID
  async getWebsiteById(id: string): Promise<WebsiteData> {
    const response = await fetch(`${API_ENDPOINT}/websites/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch website');
    }
    return response.json();
  },

  // Save a new website
  async saveWebsite(url: string, categories?: string[], projectId?: string): Promise<WebsiteData> {
    const response = await fetch(`${API_ENDPOINT}/websites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, categories, projectId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save website');
    }
    
    return response.json();
  },

  // Update website categories
  async updateWebsiteCategories(id: string, categories: string[]): Promise<WebsiteData> {
    const response = await fetch(`${API_ENDPOINT}/websites/${id}/categories`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update categories');
    }
    
    return response.json();
  },

  // Update website tags
  async updateWebsiteTags(id: string, tags: string[]): Promise<WebsiteData> {
    const response = await fetch(`${API_ENDPOINT}/websites/${id}/tags`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update tags');
    }
    
    return response.json();
  },

  // Update website notes
  async updateWebsiteNotes(id: string, notes: string): Promise<WebsiteData> {
    const response = await fetch(`${API_ENDPOINT}/websites/${id}/notes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update notes');
    }
    
    return response.json();
  },

  // Delete a website
  async deleteWebsite(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/websites/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete website');
    }
  },

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_ENDPOINT}/health`);
    return response.json();
  },

  // Project APIs
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const response = await fetch(`${API_ENDPOINT}/projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  // Get project by ID
  async getProjectById(id: string): Promise<Project> {
    const response = await fetch(`${API_ENDPOINT}/projects/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    return response.json();
  },

  // Create a new project
  async createProject(name: string, description?: string, clientName?: string): Promise<Project> {
    const response = await fetch(`${API_ENDPOINT}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, clientName }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    
    return response.json();
  },

  // Update project
  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
    const response = await fetch(`${API_ENDPOINT}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    
    return response.json();
  },

  // Delete project
  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },

  // Get websites by project ID
  async getWebsitesByProject(projectId: string): Promise<WebsiteData[]> {
    const response = await fetch(`${API_ENDPOINT}/projects/${projectId}/websites`);
    if (!response.ok) {
      throw new Error('Failed to fetch project websites');
    }
    return response.json();
  },
};
