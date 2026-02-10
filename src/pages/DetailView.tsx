import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { SavedWebsite } from '../types';
import { api } from '../api';

function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [website, setWebsite] = useState<SavedWebsite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadWebsite(id);
    }
  }, [id]);

  const loadWebsite = async (websiteId: string) => {
    try {
      setIsLoading(true);
      const data = await api.getWebsiteById(websiteId);
      setWebsite(data);
    } catch (err) {
      console.error('Error loading website:', err);
      setError('Failed to load website details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website details...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Website not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Gallery</span>
            </button>
            
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <img 
            src={`http://localhost:3001${website.heroImage}`}
            alt={website.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Website Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{website.title}</h1>
          <a 
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 underline mb-4 inline-block"
          >
            {website.url}
          </a>
          {website.category && (
            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium ml-4">
              {website.category}
            </span>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Saved on {new Date(website.savedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Colors Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Color Palette</h2>
            <div className="space-y-3">
              {website.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-20 h-12 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1">
                    <p className="font-mono text-sm font-medium text-gray-900">{color}</p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(color)}
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Typography</h2>
            <div className="space-y-4">
              {website.fonts.map((font, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-sm text-gray-600 mb-1">Font Family</p>
                  <p className="font-semibold text-gray-900" style={{ fontFamily: font }}>
                    {font}
                  </p>
                  <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: font }}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetailView;
