import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { ToastContainer } from '../components/Toast'

/**
 * Frame Selection Page - Choose photo layout (3, 4, or 6 photos)
 */
function FrameSelectionPage() {
  const navigate = useNavigate()
  const [selectedFrame, setSelectedFrame] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const frames = [
    { 
      id: 3, 
      label: '3 Photos', 
      emoji: '📷📷📷',
      description: 'Vertical layout - Perfect for single portraits',
      layout: 'vertical',
      preview: ['1', '2', '3']
    },
    { 
      id: 4, 
      label: '4 Photos', 
      emoji: '📸📸📸📸',
      description: 'Square layout (2×2) - Ideal for couples',
      layout: 'square',
      preview: ['1', '2', '3', '4']
    },
    { 
      id: 6, 
      label: '6 Photos', 
      emoji: '📷📷📷📷📷📷',
      description: 'Rectangle layout (2×3) - Great for groups',
      layout: 'rectangle',
      preview: ['1', '2', '3', '4', '5', '6']
    },
  ]

  const handleSelectFrame = (frameId) => {
    setSelectedFrame(frameId)
  }

  const handleContinue = () => {
    if (selectedFrame) {
      setIsTransitioning(true)
      setTimeout(() => {
        navigate(`/camera?frames=${selectedFrame}`)
      }, 300)
    }
  }

  const handleBack = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/')
    }, 300)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <ToastContainer />
      <div className="text-center w-full max-w-6xl">
        {/* Header */}
        <div className="mb-10 animate-slide-in">
          <h1 className="text-6xl md:text-7xl font-bold text-white text-shadow-lg mb-4">
            Choose Your Frame 🖼️
          </h1>
          <p className="text-2xl text-white/90 text-shadow">
            Select how many photos you'd like to take
          </p>
        </div>

        {/* Frame Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {frames.map((frame, index) => (
            <Card
              key={frame.id}
              onClick={() => handleSelectFrame(frame.id)}
              className={`cursor-pointer transition-all duration-300 ${
                selectedFrame === frame.id
                  ? 'ring-4 ring-yellow-400 scale-105 shadow-3xl bg-gradient-to-br from-yellow-50 to-pink-50'
                  : 'hover:ring-2 hover:ring-white/50'
              } animate-slide-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-7xl mb-4">{frame.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {frame.label}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {frame.description}
              </p>
              
              {/* Preview Grid */}
              <div className={`grid gap-2 ${
                frame.id === 3 ? 'grid-cols-1' : // Vertical - 1 column
                frame.id === 4 ? 'grid-cols-2' : // Square - 2x2
                'grid-cols-2' // Rectangle - 2 columns
              }`}>
                {frame.preview.map((num, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-600 border-2 border-white ${
                      frame.id === 3 ? 'aspect-[3/4]' : 'aspect-square'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              
              {selectedFrame === frame.id && (
                <div className="mt-4 text-yellow-600 font-bold text-lg animate-bounce">
                  ✓ Selected
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedFrame || isTransitioning}
            className="min-w-[250px]"
          >
            {isTransitioning ? 'Loading...' : `Continue with ${selectedFrame || '...'} Photos ➡️`}
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={handleBack}
            disabled={isTransitioning}
          >
            ← Back to Start
          </Button>
        </div>

        {/* Help Text */}
        {!selectedFrame && (
          <p className="mt-6 text-white/70 text-lg animate-pulse">
            👆 Click on a frame option above to select
          </p>
        )}
      </div>
    </div>
  )
}

export default FrameSelectionPage
