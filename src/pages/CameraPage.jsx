import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Countdown from '../components/Countdown'

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
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setCameraError('Unable to access camera. Please check permissions and try again.')
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
        
        if (newPhotos.length >= totalFrames) {
          stopCamera()
          setTimeout(() => {
            navigate('/template-filter', { state: { photos: newPhotos } })
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
      navigate('/template-filter', { state: { photos: [...photos] } })
    }
  }

  const handleBack = () => {
    stopCamera()
    navigate('/select-frame')
  }

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
      {/* Countdown Overlay */}
      {showCountdown && (
        <Countdown 
          seconds={3} 
          onComplete={handleCountdownComplete}
          autoStart={true}
        />
      )}

      {/* Header */}
      <div className="text-center mb-6 animate-slide-in">
        <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow-lg mb-2">
          📸 Photo {currentPhoto + 1} of {totalFrames}
        </h1>
        <p className="text-xl text-white/90 text-shadow">
          {isProcessing ? 'Processing...' : 'Get ready and strike a pose! ✨'}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4 w-full max-w-md mx-auto bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-pink-400 to-purple-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${((currentPhoto) / totalFrames) * 100}%` }}
          />
        </div>
      </div>

      {/* Camera Preview */}
      <Card className="mb-6 relative max-w-4xl w-full">
        <div className="relative bg-black rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
            style={{ transform: 'scaleX(-1)' }}
          />
          {isCapturing && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-8xl animate-bounce">📸</div>
            </div>
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-2xl">Processing...</div>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <Button
          variant="primary"
          size="lg"
          onClick={startCapture}
          disabled={isCapturing || currentPhoto >= totalFrames || showCountdown}
          className="min-w-[200px]"
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
            >
              🔄 Retake Last
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={handleFinish}
              disabled={isCapturing || showCountdown}
            >
              Finish ({photos.length}/{totalFrames}) ✅
            </Button>
          </>
        )}
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <Card className="max-w-4xl w-full mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Your Photos ({photos.length}/{totalFrames})
          </h3>
          <div className={`grid gap-3 ${
            photos.length <= 3 ? 'grid-cols-3' :
            photos.length <= 4 ? 'grid-cols-4' :
            'grid-cols-6'
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
