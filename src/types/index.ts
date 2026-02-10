export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
}

export interface SavedWebsite {
  id: string;
  url: string;
  title: string;
  heroImage: string;
  colors: string[];
  colorCategories?: {
    base: string[];
    primary: string[];
    accent: string[];
    other: string[];
  };
  mainFont?: string;
  fonts: string[];
  savedAt: string;
  category?: string;
  categories?: string[];
  tags?: string[];
  notes?: string;
  projectId?: string;
}
