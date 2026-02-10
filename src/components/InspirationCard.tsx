import { Trash2, Tag, FileText } from 'lucide-react';
import { SavedWebsite } from '../types';

interface InspirationCardProps {
  website: SavedWebsite;
  onClick: () => void;
  onDelete: () => void;
}

function InspirationCard({ website, onClick, onDelete }: InspirationCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={`http://localhost:3001${website.heroImage}`}
          alt={website.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {(website.categories || (website.category ? [website.category] : [])).length > 0 && (
          <div className="absolute top-3 right-3 flex flex-wrap gap-1 max-w-[60%] justify-end">
            {(website.categories || [website.category]).slice(0, 2).map((cat, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                {cat}
              </div>
            ))}
            {(website.categories || [website.category]).length > 2 && (
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                +{(website.categories || [website.category]).length - 2}
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleDelete}
          className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Delete website"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {website.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 truncate">{website.url}</p>

        {/* Color Palette Preview */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-600 font-medium">Colors:</span>
          <div className="flex gap-1">
            {website.colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {website.colors.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                +{website.colors.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Font Count */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>{website.fonts.length} {website.fonts.length === 1 ? 'font' : 'fonts'}</span>
          </div>
          
          {/* Tags Indicator */}
          {website.tags && website.tags.length > 0 && (
            <div className="flex items-center text-green-600">
              <Tag className="w-4 h-4 mr-1" />
              <span>{website.tags.length}</span>
            </div>
          )}
          
          {/* Notes Indicator */}
          {website.notes && website.notes.trim() && (
            <div className="flex items-center text-amber-600">
              <FileText className="w-4 h-4 mr-1" />
            </div>
          )}
        </div>
        
        {/* Tags Preview */}
        {website.tags && website.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {website.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                #{tag}
              </span>
            ))}
            {website.tags.length > 2 && (
              <span className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                +{website.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InspirationCard;
