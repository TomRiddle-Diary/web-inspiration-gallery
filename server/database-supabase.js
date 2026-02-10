import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found. Using fallback mode.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ========== Project Functions ==========

export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data || [];
}

export async function getProjectById(id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  
  return data;
}

export async function createProject(projectData) {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      id: projectData.id,
      name: projectData.name,
      description: projectData.description,
      client_name: projectData.clientName,
      created_at: projectData.createdAt,
      updated_at: projectData.updatedAt
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  
  // Convert snake_case to camelCase for response
  return {
    ...data,
    clientName: data.client_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateProject(id, updates) {
  const updateData = {
    updated_at: new Date().toISOString()
  };
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.clientName !== undefined) updateData.client_name = updates.clientName;
  
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    return null;
  }
  
  return {
    ...data,
    clientName: data.client_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteProject(id) {
  // Delete associated websites first (CASCADE should handle this, but being explicit)
  await supabase
    .from('websites')
    .delete()
    .eq('project_id', id);
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  
  return true;
}

// ========== Website Functions ==========

export async function getAllWebsites() {
  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .order('saved_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
  
  return (data || []).map(convertWebsiteFromDb);
}

export async function getWebsiteById(id) {
  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching website:', error);
    return null;
  }
  
  return convertWebsiteFromDb(data);
}

export async function saveWebsite(websiteData) {
  const { data, error } = await supabase
    .from('websites')
    .insert([{
      id: websiteData.id,
      project_id: websiteData.projectId,
      url: websiteData.url,
      title: websiteData.title,
      hero_image: websiteData.heroImage,
      colors: websiteData.colors || [],
      color_categories: websiteData.colorCategories,
      main_font: websiteData.mainFont,
      fonts: websiteData.fonts || [],
      categories: websiteData.categories || [],
      category: websiteData.category,
      tags: websiteData.tags || [],
      notes: websiteData.notes,
      screenshot_id: websiteData.screenshotId,
      saved_at: websiteData.savedAt
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving website:', error);
    throw error;
  }
  
  return convertWebsiteFromDb(data);
}

export async function updateWebsiteCategories(id, categories) {
  const { data, error } = await supabase
    .from('websites')
    .update({
      categories: categories,
      category: categories.length > 0 ? categories[0] : null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating categories:', error);
    return null;
  }
  
  return convertWebsiteFromDb(data);
}

export async function updateWebsiteTags(id, tags) {
  const { data, error } = await supabase
    .from('websites')
    .update({ tags })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating tags:', error);
    return null;
  }
  
  return convertWebsiteFromDb(data);
}

export async function updateWebsiteNotes(id, notes) {
  const { data, error } = await supabase
    .from('websites')
    .update({ notes })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating notes:', error);
    return null;
  }
  
  return convertWebsiteFromDb(data);
}

export async function deleteWebsite(id) {
  const { error } = await supabase
    .from('websites')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting website:', error);
    return false;
  }
  
  return true;
}

export async function getWebsitesByProject(projectId) {
  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('project_id', projectId)
    .order('saved_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching websites by project:', error);
    throw error;
  }
  
  return (data || []).map(convertWebsiteFromDb);
}

// Helper function to convert database format to API format
function convertWebsiteFromDb(dbWebsite) {
  return {
    id: dbWebsite.id,
    projectId: dbWebsite.project_id,
    url: dbWebsite.url,
    title: dbWebsite.title,
    heroImage: dbWebsite.hero_image,
    colors: dbWebsite.colors || [],
    colorCategories: dbWebsite.color_categories,
    mainFont: dbWebsite.main_font,
    fonts: dbWebsite.fonts || [],
    categories: dbWebsite.categories || [],
    category: dbWebsite.category,
    tags: dbWebsite.tags || [],
    notes: dbWebsite.notes,
    screenshotId: dbWebsite.screenshot_id,
    savedAt: dbWebsite.saved_at
  };
}
