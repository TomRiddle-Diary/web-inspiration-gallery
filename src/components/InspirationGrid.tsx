import { useNavigate } from 'react-router-dom';
import { SavedWebsite } from '../types';
import InspirationCard from './InspirationCard';

interface InspirationGridProps {
  websites: SavedWebsite[];
  onDelete: (id: string) => void;
  projectId?: string;
}

function InspirationGrid({ websites, onDelete, projectId }: InspirationGridProps) {
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    if (projectId) {
      navigate(`/project/${projectId}/detail/${id}`);
    } else {
      navigate(`/detail/${id}`);
    }
  };

  if (websites.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved designs yet</h3>
          <p className="text-gray-600">Start by adding a website URL above</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((website) => (
          <InspirationCard
            key={website.id}
            website={website}
            onClick={() => handleCardClick(website.id)}
            onDelete={() => onDelete(website.id)}
          />
        ))}
      </div>
    </main>
  );
}

export default InspirationGrid;
