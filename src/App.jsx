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
  return (
    <Router>
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
