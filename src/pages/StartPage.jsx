import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { ToastContainer } from '../components/Toast'
import { useEnterKey } from '../hooks/useKeyboard'

/**
 * Start Page - Welcome screen with animated introduction
 */
function StartPage() {
  const navigate = useNavigate()
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = () => {
    setIsStarting(true)
    // Show toast notification
    if (window.showToast) {
      window.showToast('Starting your photobooth experience! 🎉', 'success', 2000)
    }
    // Add a small delay for smooth transition
    setTimeout(() => {
      navigate('/select-frame')
    }, 300)
  }

  useEffect(() => {
    // Check camera availability on mount
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Camera is available
    } else {
      if (window.showToast) {
        window.showToast('Camera may not be available on this device', 'warning', 4000)
      }
    }
  }, [])

  // Keyboard navigation - Enter to start
  useEnterKey(() => {
    if (!isStarting) {
      handleStart()
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <ToastContainer />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-6xl animate-float" style={{ animationDelay: '0s' }}>✨</div>
        <div className="absolute top-40 right-32 text-5xl animate-float" style={{ animationDelay: '1s' }}>🌟</div>
        <div className="absolute bottom-32 left-32 text-6xl animate-float" style={{ animationDelay: '2s' }}>💫</div>
        <div className="absolute bottom-20 right-20 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
      </div>

      <div className="text-center z-10 animate-slide-in">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-white text-shadow-lg mb-4 animate-glow">
            🧀 Cheese & Click 📸
          </h1>
          <p className="text-3xl md:text-4xl text-white/95 text-shadow-lg font-semibold">
            Your Virtual Photobooth Experience
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
          <Card hoverable={false} className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-5xl mb-3">🖼️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Your Frame</h3>
            <p className="text-gray-600">Select from 3, 4, or 6 photo layouts</p>
          </Card>
          
          <Card hoverable={false} className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-5xl mb-3">📸</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Capture Moments</h3>
            <p className="text-gray-600">Take beautiful photos with countdown timer</p>
          </Card>
          
          <Card hoverable={false} className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-5xl mb-3">🎨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Customize & Share</h3>
            <p className="text-gray-600">Apply filters and templates, then download</p>
          </Card>
        </div>

        {/* Start Button */}
        <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <Button
            variant="primary"
            size="xl"
            onClick={handleStart}
            disabled={isStarting}
            className="min-w-[300px] w-full sm:w-auto"
            autoFocus
          >
            {isStarting ? 'Starting...' : '🎉 Start Your Photobooth Experience'}
          </Button>
          <p className="mt-4 text-white/70 text-sm">
            Press <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Enter</kbd> to start
          </p>
        </div>

        {/* Instructions */}
        <p className="mt-8 text-white/80 text-lg">
          Make sure your camera is ready! 📷
        </p>
      </div>
    </div>
  )
}

export default StartPage
