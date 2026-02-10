import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface HeaderProps {
  onAddWebsite: (url: string) => void;
  isAdding: boolean;
}

function Header({ onAddWebsite, isAdding }: HeaderProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddWebsite(url);
      setUrl('');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Design Inspiration</h1>
          <p className="text-gray-600 mt-1">Save and organize your favorite website designs</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
              disabled={isAdding}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !url.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            {isAdding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Save Website</span>
              </>
            )}
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
