import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Countdown from '../components/Countdown'
import ProgressBar from '../components/ProgressBar'
import LoadingSpinner from '../components/LoadingSpinner'
import { ToastContainer } from '../components/Toast'
import { useKeyboard } from '../hooks/useKeyboard'

/**
 * Camera Page - Capture photos with countdown timer
 */
function CameraPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const totalFrames = parseInt(searchParams.get('frames')) || 4
  
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [photos, setPhotos] = useState([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setCameraError(null)
      if (window.showToast) {
        window.showToast('Accessing camera...', 'info', 2000)
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        if (window.showToast) {
          window.showToast('Camera ready! 📷', 'success', 2000)
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      const errorMsg = error.name === 'NotAllowedError' 
        ? 'Camera permission denied. Please allow camera access.'
        : 'Unable to access camera. Please check permissions and try again.'
      setCameraError(errorMsg)
      if (window.showToast) {
        window.showToast(errorMsg, 'error', 5000)
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const handleCountdownComplete = () => {
    setShowCountdown(false)
    capturePhoto()
  }

  const startCapture = () => {
    if (currentPhoto >= totalFrames) return
    setShowCountdown(true)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return

    setIsCapturing(true)
    setIsProcessing(true)
    
    const canvas = canvasRef.current
    const video = videoRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    // Mirror the image for selfie view
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0)
    ctx.restore()
    
    const photoData = canvas.toDataURL('image/png')
    
    setTimeout(() => {
      setPhotos(prevPhotos => {
        const newPhotos = [...prevPhotos, photoData]
        setCurrentPhoto(newPhotos.length)
        setIsCapturing(false)
        setIsProcessing(false)
        
        // Show success toast
        if (window.showToast) {
          window.showToast(`Photo ${newPhotos.length} captured! ✨`, 'success', 2000)
        }
        
        if (newPhotos.length >= totalFrames) {
          if (window.showToast) {
            window.showToast('All photos captured! Moving to customization...', 'success', 3000)
          }
          stopCamera()
          setTimeout(() => {
            navigate('/template-filter', { state: { photos: newPhotos, photoCount: totalFrames } })
          }, 500)
        }
        return newPhotos
      })
    }, 300)
  }

  const retakeLastPhoto = () => {
    if (photos.length > 0) {
      setPhotos(prevPhotos => prevPhotos.slice(0, -1))
      setCurrentPhoto(prev => Math.max(0, prev - 1))
    }
  }

  const handleFinish = () => {
    if (photos.length > 0) {
      stopCamera()
      navigate('/template-filter', { state: { photos: [...photos], photoCount: totalFrames } })
    }
  }

  const handleBack = () => {
    stopCamera()
    navigate('/select-frame')
  }

  // Keyboard shortcuts
  useKeyboard({
    ' ': (e) => {
      // Spacebar to capture
      e.preventDefault()
      if (!isCapturing && !showCountdown && currentPhoto < totalFrames) {
        startCapture()
      }
    },
    'r': (e) => {
      // R to retake last photo
      if (photos.length > 0 && !isCapturing && !showCountdown) {
        retakeLastPhoto()
      }
    },
    'Escape': () => {
      // Escape to go back
      handleBack()
    }
  })

  if (cameraError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <div className="text-6xl mb-4">📷❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Camera Access Error</h2>
          <p className="text-gray-600 mb-6">{cameraError}</p>
          <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={startCamera}>
              Try Again 🔄
            </Button>
            <Button variant="ghost" onClick={handleBack}>
              ← Go Back
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <ToastContainer />
      
      {/* Countdown Overlay */}
      {showCountdown && (
        <Countdown 
          seconds={3} 
          onComplete={handleCountdownComplete}
          autoStart={true}
        />
      )}

      {/* Header */}
      <div className="text-center mb-4 md:mb-6 animate-slide-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-shadow-lg mb-2">
          📸 Photo {currentPhoto + 1} of {totalFrames}
        </h1>
        <p className="text-lg sm:text-xl text-white/90 text-shadow">
          {isProcessing ? 'Processing...' : 'Get ready and strike a pose! ✨'}
        </p>
        <p className="mt-2 text-white/70 text-sm">
          Press <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd> to capture
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4 w-full max-w-md">
          <ProgressBar progress={currentPhoto} total={totalFrames} />
        </div>
      </div>

      {/* Camera Preview */}
      <Card className="mb-4 md:mb-6 relative max-w-4xl w-full">
        <div className="relative bg-black rounded-xl md:rounded-2xl overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          {isCapturing && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-8xl animate-bounce">📸</div>
            </div>
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col gap-4">
              <LoadingSpinner size="lg" />
              <div className="text-white text-2xl font-semibold">Processing...</div>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center mb-4 md:mb-6 w-full max-w-2xl">
        <Button
          variant="primary"
          size="lg"
          onClick={startCapture}
          disabled={isCapturing || currentPhoto >= totalFrames || showCountdown}
          className="w-full sm:w-auto sm:min-w-[200px]"
        >
          {isCapturing ? 'Capturing...' : '📷 Take Photo'}
        </Button>
        
        {photos.length > 0 && (
          <>
            <Button
              variant="secondary"
              size="lg"
              onClick={retakeLastPhoto}
              disabled={isCapturing || showCountdown}
              className="w-full sm:w-auto"
            >
              🔄 Retake Last
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={handleFinish}
              disabled={isCapturing || showCountdown}
              className="w-full sm:w-auto"
            >
              Finish ({photos.length}/{totalFrames}) ✅
            </Button>
          </>
        )}
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <Card className="max-w-4xl w-full mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 text-center">
            Your Photos ({photos.length}/{totalFrames})
          </h3>
          <div className={`grid gap-2 md:gap-3 ${
            photos.length <= 3 ? 'grid-cols-3' :
            photos.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' :
            'grid-cols-3 sm:grid-cols-6'
          }`}>
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-auto rounded-lg border-2 border-pink-300 shadow-lg"
                />
                <div className="absolute top-1 right-1 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        disabled={isCapturing || showCountdown}
      >
        ← Back to Frame Selection
      </Button>
    </div>
  )
}

export default CameraPage
