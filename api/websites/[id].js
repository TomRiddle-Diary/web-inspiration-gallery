import { 
  getWebsiteById, 
  updateWebsiteCategories, 
  updateWebsiteTags, 
  updateWebsiteNotes, 
  deleteWebsite 
} from '../../server/database-supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id } = req.query;
  const segments = req.url.split('/');
  const lastSegment = segments[segments.length - 1];
  
  try {
    if (req.method === 'GET') {
      const website = await getWebsiteById(id);
      if (!website) {
        return res.status(404).json({ error: 'Website not found' });
      }
      return res.status(200).json(website);
    }
    
    if (req.method === 'PUT') {
      if (lastSegment === 'categories' || req.url.includes('/categories')) {
        const { categories } = req.body;
        
        if (!Array.isArray(categories)) {
          return res.status(400).json({ error: 'Categories must be an array' });
        }
        
        const updatedWebsite = await updateWebsiteCategories(id, categories);
        
        if (!updatedWebsite) {
          return res.status(404).json({ error: 'Website not found' });
        }
        
        return res.status(200).json(updatedWebsite);
      }
      
      if (lastSegment === 'tags' || req.url.includes('/tags')) {
        const { tags } = req.body;
        
        if (!Array.isArray(tags)) {
          return res.status(400).json({ error: 'Tags must be an array' });
        }
        
        const updatedWebsite = await updateWebsiteTags(id, tags);
        
        if (!updatedWebsite) {
          return res.status(404).json({ error: 'Website not found' });
        }
        
        return res.status(200).json(updatedWebsite);
      }
      
      if (lastSegment === 'notes' || req.url.includes('/notes')) {
        const { notes } = req.body;
        
        if (typeof notes !== 'string') {
          return res.status(400).json({ error: 'Notes must be a string' });
        }
        
        const updatedWebsite = await updateWebsiteNotes(id, notes);
        
        if (!updatedWebsite) {
          return res.status(404).json({ error: 'Website not found' });
        }
        
        return res.status(200).json(updatedWebsite);
      }
      
      return res.status(400).json({ error: 'Invalid update endpoint' });
    }
    
    if (req.method === 'DELETE') {
      const success = await deleteWebsite(id);
      if (!success) {
        return res.status(404).json({ error: 'Website not found' });
      }
      return res.status(200).json({ message: 'Website deleted successfully' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
