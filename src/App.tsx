import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectSelector from './pages/ProjectSelector';
import Gallery from './pages/Gallery';
import DetailView from './pages/DetailView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<ProjectSelector />} />
          <Route path="/project/:projectId" element={<Gallery />} />
          <Route path="/project/:projectId/detail/:id" element={<DetailView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
