import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import { ToastContainer } from '../components/Toast'
import { applyFilter, applyTemplate, loadImage } from '../utils/imageProcessing'

/**
 * Template & Filter Selection Page
 * Allows users to choose templates and filters, with live preview
 */
function TemplateFilterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const photos = location.state?.photos || []

  const [selectedTemplate, setSelectedTemplate] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [previewCanvas, setPreviewCanvas] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef(null)

  const templates = [
    { id: 1, name: 'Heart Frame', emoji: '💖', description: 'Romantic heart layout' },
    { id: 2, name: 'Star Frame', emoji: '⭐', description: 'Classic grid layout' },
    { id: 3, name: 'Flower Frame', emoji: '🌸', description: 'Beautiful flower grid' },
    { id: 4, name: 'Simple Frame', emoji: '📋', description: 'Clean and minimal' },
  ]

  const filters = [
    { id: 1, name: 'Cute Pink', emoji: '💗', filter: 'filter-pink', description: 'Warm pink tones' },
    { id: 2, name: 'Sunset', emoji: '🌅', filter: 'filter-sunset', description: 'Golden hour vibes' },
    { id: 3, name: 'Vintage', emoji: '📷', filter: 'filter-vintage', description: 'Classic sepia' },
    { id: 4, name: 'Bright', emoji: '✨', filter: 'filter-bright', description: 'Vibrant and clear' },
  ]

  useEffect(() => {
    if (photos.length === 0) {
      navigate('/')
    }
  }, [photos, navigate])

  useEffect(() => {
    if (canvasRef.current && photos.length > 0) {
      generatePreview()
    }
  }, [selectedTemplate, selectedFilter, photos])

  const generatePreview = async () => {
    if (!canvasRef.current || photos.length === 0) return

    const canvas = canvasRef.current
    canvas.width = 800
    canvas.height = 600

    try {
      // Apply template
      await applyTemplate(canvas, selectedTemplate, photos)
      
      // Apply filter if selected
      if (selectedFilter) {
        const filter = filters.find(f => f.id === selectedFilter)
        if (filter) {
          applyFilter(canvas, filter.filter)
        }
      }

      setPreviewCanvas(canvas.toDataURL('image/png'))
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      if (window.showToast) {
        window.showToast('Please select a template first!', 'warning', 3000)
      }
      return
    }

    setIsGenerating(true)
    
    if (window.showToast) {
      window.showToast('Generating your final photo...', 'info', 2000)
    }
    
    // Ensure preview is generated
    if (!previewCanvas) {
      await generatePreview()
      // Wait a bit for canvas to render
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    // Get final canvas data
    const finalImage = canvasRef.current?.toDataURL('image/png') || previewCanvas
    
    setTimeout(() => {
      if (window.showToast) {
        window.showToast('Photo generated successfully! 🎉', 'success', 2000)
      }
      navigate('/result', { 
        state: { 
          photos,
          templateId: selectedTemplate,
          filterId: selectedFilter,
          finalImage: finalImage || previewCanvas
        } 
      })
    }, 800)
  }

  const handleBack = () => {
    navigate('/camera', { state: { photos } })
  }

  return (
    <div className="min-h-screen p-4">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-shadow-lg mb-4">
            Customize Your Photos 🎨
          </h1>
          <p className="text-xl text-white/90 text-shadow">
            Choose a template and filter to make your photos perfect
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Template Selection */}
          <Card>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Choose Template 🖼️
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedTemplate === template.id
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white scale-105 shadow-xl ring-4 ring-yellow-400'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-5xl mb-2">{template.emoji}</div>
                  <p className="text-lg font-bold mb-1">{template.name}</p>
                  <p className={`text-sm ${selectedTemplate === template.id ? 'text-white/90' : 'text-gray-600'}`}>
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Filter Selection */}
          <Card>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Choose Filter ✨
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {filters.map((filter) => (
                <div
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white scale-105 shadow-xl ring-4 ring-yellow-400'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-5xl mb-2">{filter.emoji}</div>
                  <p className="text-lg font-bold mb-1">{filter.name}</p>
                  <p className={`text-sm ${selectedFilter === filter.id ? 'text-white/90' : 'text-gray-600'}`}>
                    {filter.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Live Preview 👀
          </h2>
          <div className="flex justify-center">
            {previewCanvas ? (
              <img
                src={previewCanvas}
                alt="Preview"
                className="max-w-full h-auto rounded-xl border-4 border-pink-300 shadow-2xl"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center flex-col gap-4">
                <LoadingSpinner size="lg" />
                <div className="text-gray-500 text-xl font-semibold">Generating preview...</div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </Card>

        {/* Original Photos Grid */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Your Original Photos ({photos.length})
          </h2>
          <div className={`grid gap-4 ${
            photos.length === 3 ? 'grid-cols-3' :
            photos.length === 4 ? 'grid-cols-4' :
            'grid-cols-6'
          }`}>
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-auto rounded-lg border-2 border-cute-pink shadow-lg"
                />
                <div className="absolute top-1 left-1 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            size="xl"
            onClick={handleGenerate}
            disabled={!selectedTemplate || isGenerating}
            className="min-w-[300px]"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Generating Final Image...
              </span>
            ) : (
              '🎨 Generate Final Image'
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={handleBack}
            disabled={isGenerating}
          >
            ← Back to Camera
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TemplateFilterPage
