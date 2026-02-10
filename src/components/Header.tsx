import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface HeaderProps {
  onAddWebsite: (url: string, categories: string[]) => void;
  isAdding: boolean;
  projectId?: string;
}

const CATEGORIES = [
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

function Header({ onAddWebsite, isAdding, projectId }: HeaderProps) {
  const [url, setUrl] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddWebsite(url, selectedCategories);
      setUrl('');
      setSelectedCategories([]);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Design Inspiration</h1>
          <p className="text-gray-600 mt-1">Save and organize your favorite website designs</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
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
            <div className="w-56 relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white text-left flex items-center justify-between"
                disabled={isAdding}
              >
                <span className="truncate">
                  {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Select categories'}
                </span>
                <span className="ml-2">▼</span>
              </button>
              {showCategoryDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {CATEGORIES.map(cat => (
                    <label
                      key={cat}
                      className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="mr-3 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-900">{cat}</span>
                    </label>
                  ))}
                </div>
              )}
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
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}

export default Header;
