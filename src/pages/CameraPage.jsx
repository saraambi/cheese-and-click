import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function CameraPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const totalFrames = parseInt(searchParams.get('frames')) || 4
  
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [photos, setPhotos] = useState([])
  const [isCapturing, setIsCapturing] = useState(false)
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    
    const canvas = canvasRef.current
    const video = videoRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    const photoData = canvas.toDataURL('image/png')
    
    setTimeout(() => {
      setPhotos(prevPhotos => {
        const newPhotos = [...prevPhotos, photoData]
        setCurrentPhoto(newPhotos.length)
        setIsCapturing(false)
        
        if (newPhotos.length >= totalFrames) {
          stopCamera()
          setTimeout(() => {
            navigate('/template-filter', { state: { photos: newPhotos } })
          }, 300)
        }
        return newPhotos
      })
    }, 500)
  }

  const handleFinish = () => {
    stopCamera()
    navigate('/template-filter', { state: { photos: [...photos] } })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2">
          📸 Chụp ảnh {currentPhoto + 1}/{totalFrames}
        </h1>
        <p className="text-xl text-white/90">
          Chuẩn bị tư thế đáng yêu nào! ✨
        </p>
      </div>

      <div className="card-cute mb-6 relative">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-2xl w-full max-w-2xl"
            style={{ transform: 'scaleX(-1)' }}
          />
          {isCapturing && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl">
              <div className="text-6xl animate-bounce">📸</div>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={capturePhoto}
          disabled={isCapturing || currentPhoto >= totalFrames}
          className="btn-primary text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCapturing ? 'Đang chụp...' : '📷 Chụp ảnh!'}
        </button>
        
        {photos.length > 0 && (
          <button
            onClick={handleFinish}
            className="btn-secondary text-xl"
          >
            Hoàn thành ({photos.length}/{totalFrames}) ✅
          </button>
        )}
      </div>

      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center max-w-4xl">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-lg"
            />
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/select-frame')}
        className="mt-4 text-white/80 hover:text-white text-lg underline"
      >
        ← Quay lại
      </button>
    </div>
  )
}

export default CameraPage
