import { getProjectById, updateProject, deleteProject, getWebsitesByProject } from '../../server/database-supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id } = req.query;
  
  try {
    if (req.method === 'GET') {
      // Check if requesting project websites
      if (req.url.includes('/websites')) {
        const websites = await getWebsitesByProject(id);
        return res.status(200).json(websites);
      }
      
      const project = await getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json(project);
    }
    
    if (req.method === 'PUT') {
      const { name, description, clientName } = req.body;
      
      const updates = {};
      if (name !== undefined) updates.name = name.trim();
      if (description !== undefined) updates.description = description.trim() || undefined;
      if (clientName !== undefined) updates.clientName = clientName.trim() || undefined;

      const updatedProject = await updateProject(id, updates);
      
      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      return res.status(200).json(updatedProject);
    }
    
    if (req.method === 'DELETE') {
      const success = await deleteProject(id);
      if (!success) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json({ message: 'Project deleted successfully' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
