import { useState, useEffect } from 'react'

/**
 * Countdown Timer Component
 * @param {Object} props
 * @param {number} props.seconds - Number of seconds to countdown
 * @param {Function} props.onComplete - Callback when countdown reaches 0
 * @param {boolean} props.autoStart - Start countdown automatically
 */
function Countdown({ seconds = 3, onComplete, autoStart = false }) {
  const [count, setCount] = useState(seconds)
  const [isActive, setIsActive] = useState(autoStart)

  useEffect(() => {
    if (!isActive) return

    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setIsActive(false)
      if (onComplete) onComplete()
    }
  }, [count, isActive, onComplete])

  const start = () => setIsActive(true)
  const reset = () => {
    setCount(seconds)
    setIsActive(false)
  }

  if (!isActive && !autoStart) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-center">
        {count > 0 ? (
          <div className="text-9xl font-bold text-white drop-shadow-2xl animate-pulse">
            {count}
          </div>
        ) : (
          <div className="text-8xl animate-bounce">📸</div>
        )}
      </div>
    </div>
  )
}

export default Countdown
