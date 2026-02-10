import express from 'express';
import cors from 'cors';
import { scrapeWebsite } from './scraper.js';
import { 
  getAllWebsites, 
  getWebsiteById, 
  saveWebsite, 
  updateWebsiteCategories, 
  updateWebsiteTags, 
  updateWebsiteNotes, 
  deleteWebsite,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getWebsitesByProject
} from './database.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/screenshots', express.static('screenshots'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all saved websites
app.get('/api/websites', async (req, res) => {
  try {
    const websites = await getAllWebsites();
    res.json(websites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ error: 'Failed to fetch websites' });
  }
});

// Get single website by ID
app.get('/api/websites/:id', async (req, res) => {
  try {
    const website = await getWebsiteById(req.params.id);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.json(website);
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).json({ error: 'Failed to fetch website' });
  }
});

// Save a new website (scrape and store)
app.post('/api/websites', async (req, res) => {
  try {
    const { url, categories, projectId } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Scraping website: ${url}`);
    
    // Scrape the website
    const scrapedData = await scrapeWebsite(url, categories);
    
    // Add projectId to the scraped data if provided
    if (projectId) {
      scrapedData.projectId = projectId;
    }
    
    // Save to database
    const savedWebsite = await saveWebsite(scrapedData);
    
    console.log(`Website saved with ID: ${savedWebsite.id}`);
    res.json(savedWebsite);
    
  } catch (error) {
    console.error('Error saving website:', error);
    res.status(500).json({ 
      error: 'Failed to scrape and save website',
      message: error.message 
    });
  }
});

// Update website categories
app.put('/api/websites/:id/categories', async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'Categories must be an array' });
    }
    
    const updatedWebsite = await updateWebsiteCategories(req.params.id, categories);
    
    if (!updatedWebsite) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json(updatedWebsite);
  } catch (error) {
    console.error('Error updating categories:', error);
    res.status(500).json({ error: 'Failed to update categories' });
  }
});

// Update website tags
app.put('/api/websites/:id/tags', async (req, res) => {
  try {
    const { tags } = req.body;
    
    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags must be an array' });
    }
    
    const updatedWebsite = await updateWebsiteTags(req.params.id, tags);
    
    if (!updatedWebsite) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json(updatedWebsite);
  } catch (error) {
    console.error('Error updating tags:', error);
    res.status(500).json({ error: 'Failed to update tags' });
  }
});

// Update website notes
app.put('/api/websites/:id/notes', async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (typeof notes !== 'string') {
      return res.status(400).json({ error: 'Notes must be a string' });
    }
    
    const updatedWebsite = await updateWebsiteNotes(req.params.id, notes);
    
    if (!updatedWebsite) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json(updatedWebsite);
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

// Delete a website
app.delete('/api/websites/:id', async (req, res) => {
  try {
    const success = await deleteWebsite(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.json({ message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({ error: 'Failed to delete website' });
  }
});

// ========== PROJECT ENDPOINTS ==========

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, clientName } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const projectData = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim() || undefined,
      clientName: clientName?.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedProject = await createProject(projectData);
    console.log(`Project created with ID: ${savedProject.id}`);
    res.json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { name, description, clientName } = req.body;
    
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim() || undefined;
    if (clientName !== undefined) updates.clientName = clientName.trim() || undefined;

    const updatedProject = await updateProject(req.params.id, updates);
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const success = await deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Get all websites for a project
app.get('/api/projects/:id/websites', async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const websites = await getWebsitesByProject(req.params.id);
    res.json(websites);
  } catch (error) {
    console.error('Error fetching project websites:', error);
    res.status(500).json({ error: 'Failed to fetch project websites' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
