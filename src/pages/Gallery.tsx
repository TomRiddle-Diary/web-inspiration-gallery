import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import InspirationGrid from '../components/InspirationGrid';
import { SavedWebsite } from '../types';
import { api, Project } from '../api';

const CATEGORIES = [
  'All',
  'Landing Pages',
  'E-commerce',
  'Portfolio',
  'Blog',
  'Restaurant',
  'Technology',
  'Agency',
  'SaaS',
  'Fashion',
  'Education',
  'Other'
];

function Gallery() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [websites, setWebsites] = useState<SavedWebsite[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<SavedWebsite[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load project and websites on mount
  useEffect(() => {
    if (projectId) {
      loadProject();
      loadWebsites();
    }
  }, [projectId]);

  // Filter websites when categories or search query change
  useEffect(() => {
    let filtered = websites;
    
    // Filter by categories
    if (!selectedCategories.includes('All') && selectedCategories.length > 0) {
      filtered = filtered.filter(w => {
        const websiteCategories = w.categories || (w.category ? [w.category] : []);
        return websiteCategories.some(cat => selectedCategories.includes(cat));
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => {
        const titleMatch = w.title.toLowerCase().includes(query);
        const urlMatch = w.url.toLowerCase().includes(query);
        const tagsMatch = (w.tags || []).some(tag => tag.toLowerCase().includes(query));
        const notesMatch = (w.notes || '').toLowerCase().includes(query);
        return titleMatch || urlMatch || tagsMatch || notesMatch;
      });
    }
    
    setFilteredWebsites(filtered);
  }, [selectedCategories, searchQuery, websites]);

  const loadProject = async () => {
    if (!projectId) return;
    
    try {
      const data = await api.getProjectById(projectId);
      setProject(data);
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project.');
    }
  };

  const loadWebsites = async () => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getWebsitesByProject(projectId);
      setWebsites(data);
    } catch (err) {
      console.error('Error loading websites:', err);
      setError('Failed to load websites. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebsite = async (url: string, categories: string[]) => {
    setIsAdding(true);
    setError(null);
    
    try {
      const newWebsite = await api.saveWebsite(url, categories, projectId);
      setWebsites([newWebsite, ...websites]);
    } catch (err: any) {
      console.error('Error adding website:', err);
      setError(err.message || 'Failed to save website');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    if (!confirm('Are you sure you want to delete this website?')) {
      return;
    }
    
    try {
      await api.deleteWebsite(id);
      setWebsites(websites.filter(w => w.id !== id));
    } catch (err: any) {
      console.error('Error deleting website:', err);
      setError(err.message || 'Failed to delete website');
    }
  };

  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      setSelectedCategories(prev => {
        // Remove 'All' if it's selected
        const withoutAll = prev.filter(c => c !== 'All');
        
        if (prev.includes(category)) {
          // Deselect category
          const newSelection = withoutAll.filter(c => c !== category);
          // If nothing selected, default to 'All'
          return newSelection.length === 0 ? ['All'] : newSelection;
        } else {
          // Select category
          return [...withoutAll, category];
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">プロジェクト一覧</span>
              </button>
              {project && (
                <div className="border-l border-gray-300 pl-4">
                  <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
                  {project.clientName && (
                    <p className="text-sm text-gray-600">クライアント: {project.clientName}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Header onAddWebsite={handleAddWebsite} isAdding={isAdding} projectId={projectId} />
      
      {error && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}
      
      {/* Search and Filter */}
      {!isLoading && websites.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, URL, tags, or notes..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
              {selectedCategories.length > 1 && !selectedCategories.includes('All') && (
                <button
                  onClick={() => setSelectedCategories(['All'])}
                  className="text-xs text-indigo-600 hover:text-indigo-700 underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => {
                const isSelected = selectedCategories.includes(category);
                const count = category === 'All' 
                  ? websites.length 
                  : websites.filter(w => {
                      const cats = w.categories || (w.category ? [w.category] : []);
                      return cats.includes(category);
                    }).length;
                
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category}
                    <span className={`ml-1.5 text-xs ${isSelected ? 'opacity-90' : 'opacity-75'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your saved designs...</p>
          </div>
        </div>
      ) : (
        <InspirationGrid websites={filteredWebsites} onDelete={handleDeleteWebsite} projectId={projectId} />
      )}
    </div>
  );
}

export default Gallery;
