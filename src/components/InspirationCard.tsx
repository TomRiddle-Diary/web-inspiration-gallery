import { SavedWebsite } from '../types';

interface InspirationCardProps {
  website: SavedWebsite;
  onClick: () => void;
}

function InspirationCard({ website, onClick }: InspirationCardProps) {
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
        {website.category && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800">
            {website.category}
          </div>
        )}
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
        <div className="flex items-center text-xs text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>{website.fonts.length} {website.fonts.length === 1 ? 'font' : 'fonts'}</span>
        </div>
      </div>
    </div>
  );
}

export default InspirationCard;
