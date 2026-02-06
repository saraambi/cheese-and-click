import { useEffect } from 'react'

/**
 * Custom hook for keyboard navigation
 * @param {Object} handlers - Object with key handlers { 'Enter': fn, 'Escape': fn, etc. }
 */
export function useKeyboard(handlers) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const handler = handlers[event.key]
      if (handler) {
        handler(event)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handlers])
}

/**
 * Hook for Enter key to trigger action
 */
export function useEnterKey(action) {
  useKeyboard({
    Enter: action
  })
}
