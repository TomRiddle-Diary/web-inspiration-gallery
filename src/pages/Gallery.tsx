import { useState, useEffect } from 'react';
import Header from '../components/Header';
import InspirationGrid from '../components/InspirationGrid';
import { SavedWebsite } from '../types';
import { api } from '../api';

function Gallery() {
  const [websites, setWebsites] = useState<SavedWebsite[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load websites on mount
  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getAllWebsites();
      setWebsites(data);
    } catch (err) {
      console.error('Error loading websites:', err);
      setError('Failed to load websites. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebsite = async (url: string) => {
    setIsAdding(true);
    setError(null);
    
    try {
      const newWebsite = await api.saveWebsite(url);
      setWebsites([newWebsite, ...websites]);
    } catch (err: any) {
      console.error('Error adding website:', err);
      setError(err.message || 'Failed to save website');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddWebsite={handleAddWebsite} isAdding={isAdding} />
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
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
        <InspirationGrid websites={websites} />
      )}
    </div>
  );
}

export default Gallery;
