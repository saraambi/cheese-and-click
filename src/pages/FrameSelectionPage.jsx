import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function FrameSelectionPage() {
  const navigate = useNavigate()
  const [selectedFrame, setSelectedFrame] = useState(null)

  const frames = [
    { id: 3, label: '3 Ảnh', emoji: '📷📷📷' },
    { id: 4, label: '4 Ảnh', emoji: '📸📸📸📸' },
    { id: 6, label: '6 Ảnh', emoji: '📷📷📷📷📷📷' },
  ]

  const handleSelectFrame = (frameId) => {
    setSelectedFrame(frameId)
  }

  const handleContinue = () => {
    if (selectedFrame) {
      navigate(`/camera?frames=${selectedFrame}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center w-full max-w-4xl">
        <h1 className="text-6xl font-bold text-white drop-shadow-2xl mb-8">
          Chọn khung ảnh của bạn! 🖼️
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {frames.map((frame) => (
            <div
              key={frame.id}
              onClick={() => handleSelectFrame(frame.id)}
              className={`card-cute cursor-pointer ${
                selectedFrame === frame.id
                  ? 'ring-4 ring-yellow-400 scale-110'
                  : ''
              }`}
            >
              <div className="text-6xl mb-4">{frame.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {frame.label}
              </h2>
              <p className="text-lg text-gray-600">
                Khung {frame.id} ảnh
              </p>
            </div>
          ))}
        </div>

        {selectedFrame && (
          <button
            onClick={handleContinue}
            className="btn-primary text-xl"
          >
            Tiếp tục với {selectedFrame} ảnh ➡️
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-4 text-white/80 hover:text-white text-lg underline"
        >
          ← Quay lại
        </button>
      </div>
    </div>
  )
}

export default FrameSelectionPage
