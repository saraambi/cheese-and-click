import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import FrameSelectionPage from './pages/FrameSelectionPage'
import CameraPage from './pages/CameraPage'
import TemplateFilterPage from './pages/TemplateFilterPage'
import ResultPage from './pages/ResultPage'
import './index.css'

/**
 * Main App Component
 * Handles routing for the photobooth application
 */
function App() {
  // Get base path for GitHub Pages (if deployed to subdirectory)
  const basePath = import.meta.env.BASE_URL || '/'
  
  return (
    <Router basename={basePath}>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/select-frame" element={<FrameSelectionPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/template-filter" element={<TemplateFilterPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  )
}

export default App
