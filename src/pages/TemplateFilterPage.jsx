import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function TemplateFilterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const photos = location.state?.photos || []

  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [finalResult, setFinalResult] = useState(null)

  const templates = [
    { id: 1, name: 'Khung trái tim', emoji: '💖', class: 'heart-frame' },
    { id: 2, name: 'Khung ngôi sao', emoji: '⭐', class: 'star-frame' },
    { id: 3, name: 'Khung hoa', emoji: '🌸', class: 'flower-frame' },
    { id: 4, name: 'Khung đơn giản', emoji: '📋', class: 'simple-frame' },
  ]

  const filters = [
    { id: 1, name: 'Cute Pink', emoji: '💗', filter: 'filter-pink' },
    { id: 2, name: 'Sunset', emoji: '🌅', filter: 'filter-sunset' },
    { id: 3, name: 'Vintage', emoji: '📷', filter: 'filter-vintage' },
    { id: 4, name: 'Bright', emoji: '✨', filter: 'filter-bright' },
  ]

  useEffect(() => {
    if (photos.length === 0) {
      navigate('/')
    }
  }, [photos, navigate])

  const handleGenerate = () => {
    if (selectedTemplate && selectedFilter) {
      // Simulate generating final result
      setFinalResult({
        template: selectedTemplate,
        filter: selectedFilter,
        photos: photos,
      })
    }
  }

  const handleRestart = () => {
    navigate('/')
  }

  if (finalResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white drop-shadow-2xl mb-8">
            🎉 Hoàn thành! 🎉
          </h1>
          
          <div className="card-cute max-w-4xl mx-auto mb-8">
            <div className={`grid gap-4 mb-6 ${
              photos.length === 3 ? 'grid-cols-3' :
              photos.length === 4 ? 'grid-cols-2' :
              photos.length === 6 ? 'grid-cols-3' :
              'grid-cols-2'
            }`}>
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-auto rounded-lg border-4 border-cute-pink shadow-lg"
                />
              ))}
            </div>
            <p className="text-2xl text-gray-700 mb-4">
              Template: {templates.find(t => t.id === selectedTemplate)?.name} {templates.find(t => t.id === selectedTemplate)?.emoji}
            </p>
            <p className="text-2xl text-gray-700">
              Filter: {filters.find(f => f.id === selectedFilter)?.name} {filters.find(f => f.id === selectedFilter)?.emoji}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={handleRestart} className="btn-primary text-xl">
              Chụp lại từ đầu 🔄
            </button>
            <button className="btn-secondary text-xl">
              Tải xuống 💾
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-8 text-center">
          Chọn Template & Filter 🎨
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Template Selection */}
          <div className="card-cute">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Chọn Template 🖼️
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white scale-105'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-5xl mb-2">{template.emoji}</div>
                  <p className="text-lg font-bold">{template.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Selection */}
          <div className="card-cute">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Chọn Filter ✨
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {filters.map((filter) => (
                <div
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white scale-105'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-5xl mb-2">{filter.emoji}</div>
                  <p className="text-lg font-bold">{filter.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        {photos.length > 0 && (
          <div className="card-cute mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Xem trước ảnh của bạn 📸
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-auto rounded-lg border-2 border-cute-pink"
                />
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={!selectedTemplate || !selectedFilter}
            className="btn-primary text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tạo ảnh cuối cùng! 🎨
          </button>
        </div>
      </div>
    </div>
  )
}

export default TemplateFilterPage
