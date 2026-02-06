import React from 'react'

/**
 * Reusable Card Component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {boolean} props.hoverable
 * @param {Function} props.onClick
 */
function Card({ children, className = '', hoverable = true, onClick, ...props }) {
  const baseClasses = 'bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8'
  const hoverClasses = hoverable ? 'transform transition-all duration-300 hover:scale-105 cursor-pointer' : ''
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
