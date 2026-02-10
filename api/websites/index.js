import { getAllWebsites, saveWebsite } from '../../server/database-supabase.js';
import { scrapeWebsite } from '../../server/scraper-vercel.js';

export const config = {
  maxDuration: 60, // Maximum execution time in seconds (Vercel Pro feature)
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    if (req.method === 'GET') {
      const websites = await getAllWebsites();
      return res.status(200).json(websites);
    }
    
    if (req.method === 'POST') {
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
      return res.status(200).json(savedWebsite);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to scrape and save website',
      message: error.message 
    });
  }
}
