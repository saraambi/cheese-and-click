import { useNavigate } from 'react-router-dom'

function StartPage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/select-frame')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8 animate-bounce-slow">
          <h1 className="text-7xl font-bold text-white drop-shadow-2xl mb-4">
            🧀 Cheese & Click 📸
          </h1>
          <p className="text-3xl text-white/90 drop-shadow-lg">
            Virtual Photobooth của bạn!
          </p>
        </div>
        
        <div className="card-cute max-w-md mx-auto mb-8">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-xl text-gray-700 mb-6">
            Chụp ảnh đáng yêu với khung và filter siêu cute!
          </p>
        </div>

        <button
          onClick={handleStart}
          className="btn-primary text-2xl animate-pulse-slow"
        >
          Bắt đầu thôi! 🎉
        </button>
      </div>
    </div>
  )
}

export default StartPage
