import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import FrameSelectionPage from './pages/FrameSelectionPage'
import CameraPage from './pages/CameraPage'
import TemplateFilterPage from './pages/TemplateFilterPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/select-frame" element={<FrameSelectionPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/template-filter" element={<TemplateFilterPage />} />
      </Routes>
    </Router>
  )
}

export default App
