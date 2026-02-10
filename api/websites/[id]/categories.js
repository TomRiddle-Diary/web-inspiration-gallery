import { updateWebsiteCategories } from '../../../server/database-supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id } = req.query;
  
  try {
    if (req.method === 'PUT') {
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
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
