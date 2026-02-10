import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.json');

// Initialize database file if it doesn't exist
async function initDatabase() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ websites: [] }, null, 2));
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
