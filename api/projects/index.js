import { getAllProjects, createProject } from '../../lib/database.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    if (req.method === 'GET') {
      const projects = await getAllProjects();
      return res.status(200).json(projects);
    }
    
    if (req.method === 'POST') {
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
      return res.status(200).json(savedProject);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
