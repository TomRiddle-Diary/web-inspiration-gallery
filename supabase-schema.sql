-- Supabase Database Schema for Inspiration App

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Websites table
CREATE TABLE IF NOT EXISTS websites (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  colors JSONB DEFAULT '[]'::jsonb,
  color_categories JSONB,
  main_font TEXT,
  fonts JSONB DEFAULT '[]'::jsonb,
  categories JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  screenshot_id TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_websites_project_id ON websites(project_id);
CREATE INDEX IF NOT EXISTS idx_websites_saved_at ON websites(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Enable Row Level Security (optional, for future auth)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (you can add auth policies later)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on websites" ON websites FOR ALL USING (true);
