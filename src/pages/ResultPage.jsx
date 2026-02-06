import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { ToastContainer } from '../components/Toast'

/**
 * Result Page - Display final processed image with download and share options
 */
function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { photos, templateId, filterId, finalImage } = location.state || {}

  const [downloadReady, setDownloadReady] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)

  useEffect(() => {
    if (!photos || photos.length === 0) {
      navigate('/')
      return
    }
    setDownloadReady(true)
  }, [photos, navigate])

  const handleDownload = () => {
    if (!finalImage) {
      if (window.showToast) {
        window.showToast('Image not ready yet', 'warning', 2000)
      }
      return
    }

    const link = document.createElement('a')
    link.href = finalImage
    link.download = `cheese-and-click-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    if (window.showToast) {
      window.showToast('Photo downloaded successfully! 💾', 'success', 3000)
    }
  }

  const handleShare = async () => {
    if (!finalImage) return

    try {
      // Convert data URL to blob
      const response = await fetch(finalImage)
      const blob = await response.blob()
      const file = new File([blob], 'photobooth.png', { type: 'image/png' })

      if (navigator.share) {
        await navigator.share({
          title: 'My Photobooth Photo',
          text: 'Check out my photobooth photo!',
          files: [file]
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(finalImage)
        if (window.showToast) {
          window.showToast('Image URL copied to clipboard!', 'success', 3000)
        }
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback: download
      handleDownload()
    }
  }

  const handlePrint = () => {
    if (!finalImage) return
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Photo</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${finalImage}" alt="Photobooth Photo" />
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleRestart = () => {
    navigate('/')
  }

  const handleNewSession = () => {
    navigate('/select-frame')
  }

  if (!photos || photos.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen p-4">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-6xl md:text-7xl font-bold text-white text-shadow-lg mb-4">
            All Done!
          </h1>
          <p className="text-2xl text-white/90 text-shadow">
            Your photobooth experience is complete
          </p>
        </div>

        {/* Final Result */}
        <Card className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Final Photo ✨
            </h2>
            {finalImage ? (
              <div className="relative inline-block">
                <img
                  src={finalImage}
                  alt="Final Photobooth Result"
                  className="max-w-full h-auto rounded-xl border-4 border-pink-300 shadow-2xl"
                />
                {downloadReady && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                    Ready!
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-gray-500 text-xl">Processing final image...</div>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            variant="primary"
            size="lg"
            onClick={handleDownload}
            disabled={!downloadReady || !finalImage}
            className="w-full"
          >
            💾 Download
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleShare}
            disabled={!downloadReady || !finalImage}
            className="w-full"
          >
            📤 Share
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handlePrint}
            disabled={!downloadReady || !finalImage}
            className="w-full"
          >
            🖨️ Print
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={handleNewSession}
            className="w-full"
          >
            📸 New Session
          </Button>
        </div>

        {/* Original Photos Reference */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Original Photos ({photos.length})
          </h3>
          <div className={`grid gap-3 ${
            photos.length === 3 ? 'grid-cols-3' :
            photos.length === 4 ? 'grid-cols-4' :
            'grid-cols-6'
          }`}>
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Original ${index + 1}`}
                  className="w-full h-auto rounded-lg border-2 border-gray-300"
                />
                <div className="absolute top-1 left-1 bg-gray-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Restart Button */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleRestart}
          >
            🏠 Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
