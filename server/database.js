import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.json');

// Initialize database file if it doesn't exist
async function initDatabase() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ projects: [], websites: [] }, null, 2));
  }
}

// Read database
async function readDatabase() {
  await initDatabase();
  const data = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write database
async function writeDatabase(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Get all websites
export async function getAllWebsites() {
  const db = await readDatabase();
  return db.websites.sort((a, b) => 
    new Date(b.savedAt) - new Date(a.savedAt)
  );
}

// Get website by ID
export async function getWebsiteById(id) {
  const db = await readDatabase();
  return db.websites.find(w => w.id === id);
}

// Save website
export async function saveWebsite(websiteData) {
  const db = await readDatabase();
  db.websites.push(websiteData);
  await writeDatabase(db);
  return websiteData;
}

// Update website categories
export async function updateWebsiteCategories(id, categories) {
  const db = await readDatabase();
  const website = db.websites.find(w => w.id === id);
  
  if (!website) {
    return null;
  }
  
  website.categories = categories;
  website.category = categories.length > 0 ? categories[0] : undefined;
  await writeDatabase(db);
  return website;
}

// Update website tags
export async function updateWebsiteTags(id, tags) {
  const db = await readDatabase();
  const website = db.websites.find(w => w.id === id);
  
  if (!website) {
    return null;
  }
  
  website.tags = tags;
  await writeDatabase(db);
  return website;
}

// Update website notes
export async function updateWebsiteNotes(id, notes) {
  const db = await readDatabase();
  const website = db.websites.find(w => w.id === id);
  
  if (!website) {
    return null;
  }
  
  website.notes = notes;
  await writeDatabase(db);
  return website;
}

// Delete website
export async function deleteWebsite(id) {
  const db = await readDatabase();
  const index = db.websites.findIndex(w => w.id === id);
  
  if (index === -1) {
    return false;
  }
  
  // Delete screenshot file
  const website = db.websites[index];
  if (website.screenshotId) {
    try {
      const screenshotPath = path.join(process.cwd(), 'screenshots', `${website.screenshotId}.png`);
      await fs.unlink(screenshotPath);
    } catch (error) {
      console.error('Error deleting screenshot:', error);
    }
  }
  
  db.websites.splice(index, 1);
  await writeDatabase(db);
  return true;
}

// ========== Project Functions ==========

// Get all projects
export async function getAllProjects() {
  const db = await readDatabase();
  if (!db.projects) {
    db.projects = [];
    await writeDatabase(db);
  }
  return db.projects.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}

// Get project by ID
export async function getProjectById(id) {
  const db = await readDatabase();
  if (!db.projects) {
    return null;
  }
  return db.projects.find(p => p.id === id);
}

// Create project
export async function createProject(projectData) {
  const db = await readDatabase();
  if (!db.projects) {
    db.projects = [];
  }
  db.projects.push(projectData);
  await writeDatabase(db);
  return projectData;
}

// Update project
export async function updateProject(id, updates) {
  const db = await readDatabase();
  if (!db.projects) {
    return null;
  }
  
  const project = db.projects.find(p => p.id === id);
  if (!project) {
    return null;
  }
  
  Object.assign(project, updates);
  project.updatedAt = new Date().toISOString();
  await writeDatabase(db);
  return project;
}

// Delete project
export async function deleteProject(id) {
  const db = await readDatabase();
  if (!db.projects) {
    return false;
  }
  
  const index = db.projects.findIndex(p => p.id === id);
  if (index === -1) {
    return false;
  }
  
  // Also delete all websites in this project
  const websitesToDelete = db.websites.filter(w => w.projectId === id);
  for (const website of websitesToDelete) {
    await deleteWebsite(website.id);
  }
  
  db.projects.splice(index, 1);
  await writeDatabase(db);
  return true;
}

// Get websites by project ID
export async function getWebsitesByProject(projectId) {
  const db = await readDatabase();
  return db.websites
    .filter(w => w.projectId === projectId)
    .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}
