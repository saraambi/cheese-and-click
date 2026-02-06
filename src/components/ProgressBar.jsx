/**
 * Progress Bar Component
 * Shows progress with animation
 */
function ProgressBar({ progress = 0, total = 100, showLabel = true, className = '' }) {
  const percentage = Math.min(100, Math.max(0, (progress / total) * 100))

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-white text-shadow">
          <span className="font-semibold">Progress</span>
          <span className="font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 h-full transition-all duration-500 ease-out rounded-full relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
