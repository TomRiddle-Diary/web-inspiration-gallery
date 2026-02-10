import express from 'express';
import cors from 'cors';
import { scrapeWebsite } from './scraper.js';
import { getAllWebsites, getWebsiteById, saveWebsite, deleteWebsite } from './database.js';

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
    const { url } = req.body;
    
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
    const scrapedData = await scrapeWebsite(url);
    
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
