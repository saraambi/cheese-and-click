import React from 'react'

/**
 * Reusable Button Component
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'danger' | 'ghost'
 * @param {string} props.size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} props.disabled
 * @param {React.ReactNode} props.children
 * @param {Function} props.onClick
 * @param {string} props.className
 */
function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  children, 
  onClick,
  className = '',
  ...props 
}) {
  const baseClasses = 'font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600',
    secondary: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-600',
    danger: 'bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600',
    ghost: 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/50'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
