/**
 * Image Processing Utilities
 * Functions to apply filters, layouts, and decorative frames
 */

/**
 * Draw rounded rectangle (polyfill for older browsers)
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * Apply filter to image canvas
 * @param {HTMLCanvasElement} canvas
 * @param {string} filterName - Filter name to apply
 */
export function applyFilter(canvas, filterName) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  switch (filterName) {
    case 'filter-pink':
      // Cute pink filter - warm tones
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.2) // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.1) // Green
        data[i + 2] = Math.min(255, data[i + 2] * 1.15) // Blue
      }
      break

    case 'filter-sunset':
      // Sunset filter - warm orange tones
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.3) // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.1) // Green
        data[i + 2] = Math.min(255, data[i + 2] * 0.9) // Blue
      }
      break

    case 'filter-vintage':
      // Vintage filter - sepia tones
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
      }
      break

    case 'filter-bright':
      // Bright filter - increase brightness and contrast
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.2 + 20) // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.2 + 20) // Green
        data[i + 2] = Math.min(255, data[i + 2] * 1.2 + 20) // Blue
      }
      break

    default:
      return // No filter applied
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Create image from data URL
 * @param {string} dataUrl
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

/**
 * Adapt layout to fit image aspect ratios without distortion
 * @param {Array} layout - Original layout grid
 * @param {Array} images - Array of loaded images
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} photoCount - Number of photos
 * @returns {Array} Adapted layout array
 */
function adaptLayoutToImages(layout, images, width, height, photoCount) {
  if (!images || images.length === 0 || images.every(img => !img)) {
    return layout // Return original if no images
  }

  const padding = width * 0.005 // Reduced padding
  const gap = height * 0.01

  switch (photoCount) {
    case 3:
      // Vertical layout - adapt width to fit images, maintain vertical stacking
      // Calculate average aspect ratio of all images
      const avgAspect = images
        .filter(img => img)
        .reduce((sum, img) => sum + (img.width / img.height), 0) / images.filter(img => img).length
      
      // Calculate optimal width based on average aspect ratio
      const totalHeight = height - padding * 2 - gap * 2
      const photoHeight = totalHeight / 3
      const optimalWidth = photoHeight * avgAspect
      
      // Use optimal width or available width, whichever is smaller
      const photoWidth = Math.min(optimalWidth, width - padding * 2)
      const startX = (width - photoWidth) / 2 // Center horizontally
      
      return [
        { x: startX, y: padding, w: photoWidth, h: photoHeight },
        { x: startX, y: padding + photoHeight + gap, w: photoWidth, h: photoHeight },
        { x: startX, y: padding + (photoHeight + gap) * 2, w: photoWidth, h: photoHeight }
      ]

    case 4:
      // Square layout - adapt each square to fit its image
      const squareArea = (width - padding * 2 - gap) / 2
      const adaptedSquares = []
      
      for (let i = 0; i < 4; i++) {
        if (images[i]) {
          const imgAspect = images[i].width / images[i].height
          let squareSize
          
          if (imgAspect > 1) {
            // Wider image - fit to width
            squareSize = squareArea
          } else {
            // Taller image - fit to height
            squareSize = squareArea
          }
          
          const col = i % 2
          const row = Math.floor(i / 2)
          adaptedSquares.push({
            x: padding + col * (squareSize + gap),
            y: padding + row * (squareSize + gap),
            w: squareSize,
            h: squareSize
          })
        } else {
          adaptedSquares.push(layout[i])
        }
      }
      return adaptedSquares

    case 6:
      // Rectangle layout - adapt each cell to fit its image
      const colWidth = (width - padding * 2 - gap) / 2
      const rowHeight = (height - padding * 2 - gap * 2) / 3
      const adaptedRects = []
      
      for (let i = 0; i < 6; i++) {
        if (images[i]) {
          const imgAspect = images[i].width / images[i].height
          const boxAspect = colWidth / rowHeight
          
          let cellWidth, cellHeight
          if (imgAspect > boxAspect) {
            // Image is wider - fit to width
            cellWidth = colWidth
            cellHeight = colWidth / imgAspect
          } else {
            // Image is taller - fit to height
            cellHeight = rowHeight
            cellWidth = rowHeight * imgAspect
          }
          
          const col = i % 2
          const row = Math.floor(i / 2)
          const cellX = padding + col * (colWidth + gap) + (colWidth - cellWidth) / 2
          const cellY = padding + row * (rowHeight + gap) + (rowHeight - cellHeight) / 2
          
          adaptedRects.push({
            x: cellX,
            y: cellY,
            w: cellWidth,
            h: cellHeight
          })
        } else {
          adaptedRects.push(layout[i])
        }
      }
      return adaptedRects

    default:
      return layout
  }
}

/**
 * Get layout grid based on number of photos
 * @param {number} photoCount - Number of photos (3, 4, or 6)
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Array} Array of {x, y, w, h} objects
 */
function getLayoutGrid(photoCount, width, height) {
  // Minimal padding only for frame decoration space
  const padding = width * 0.005 // Reduced padding for tighter canvas
  const gap = height * 0.01 // Small gap between photos

  switch (photoCount) {
    case 3:
      // Vertical layout - 3 photos stacked vertically, fill full width
      const photoHeight = (height - padding * 2 - gap * 2) / 3
      const photoWidth = width - padding * 2 // Fill almost full width (98%)
      return [
        { x: padding, y: padding, w: photoWidth, h: photoHeight },
        { x: padding, y: padding + photoHeight + gap, w: photoWidth, h: photoHeight },
        { x: padding, y: padding + (photoHeight + gap) * 2, w: photoWidth, h: photoHeight }
      ]

    case 4:
      // Square layout - 2x2 grid, fill full width
      const squareSize = (width - padding * 2 - gap) / 2
      return [
        { x: padding, y: padding, w: squareSize, h: squareSize },
        { x: padding + squareSize + gap, y: padding, w: squareSize, h: squareSize },
        { x: padding, y: padding + squareSize + gap, w: squareSize, h: squareSize },
        { x: padding + squareSize + gap, y: padding + squareSize + gap, w: squareSize, h: squareSize }
      ]

    case 6:
      // Rectangle layout - 2 columns x 3 rows, fill full width
      const colWidth = (width - padding * 2 - gap) / 2
      const rowHeight = (height - padding * 2 - gap * 2) / 3
      return [
        { x: padding, y: padding, w: colWidth, h: rowHeight },
        { x: padding + colWidth + gap, y: padding, w: colWidth, h: rowHeight },
        { x: padding, y: padding + rowHeight + gap, w: colWidth, h: rowHeight },
        { x: padding + colWidth + gap, y: padding + rowHeight + gap, w: colWidth, h: rowHeight },
        { x: padding, y: padding + (rowHeight + gap) * 2, w: colWidth, h: rowHeight },
        { x: padding + colWidth + gap, y: padding + (rowHeight + gap) * 2, w: colWidth, h: rowHeight }
      ]

    default:
      // Fallback to vertical - fill full width
      const defaultHeight = (height - padding * 2 - (photoCount - 1) * gap) / photoCount
      return Array.from({ length: photoCount }, (_, i) => ({
        x: padding,
        y: padding + i * (defaultHeight + gap),
        w: width - padding * 2, // Fill almost full width
        h: defaultHeight
      }))
  }
}

/**
 * Draw decorative frame around the layout (not the entire canvas)
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} layout - Array of {x, y, w, h} objects representing photo positions
 * @param {Object} frameConfig - Frame configuration object {bgColor, patternColor, patternType}
 */
function drawDecorativeFrame(ctx, layout, frameConfig) {
  if (!layout || layout.length === 0) return

  // Calculate bounding box of the layout
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  
  layout.forEach(photo => {
    minX = Math.min(minX, photo.x)
    minY = Math.min(minY, photo.y)
    maxX = Math.max(maxX, photo.x + photo.w)
    maxY = Math.max(maxY, photo.y + photo.h)
  })

  // Add padding around layout for frame decoration (increased for more space)
  const padding = Math.min((maxX - minX), (maxY - minY)) * 0.04 // Increased from 0.02 to 0.04
  const frameX = minX - padding
  const frameY = minY - padding
  const frameWidth = maxX - minX + padding * 2
  const frameHeight = maxY - minY + padding * 2

  const frameThickness = Math.min(frameWidth, frameHeight) * 0.02

  ctx.save()
  ctx.strokeStyle = frameConfig.patternColor
  ctx.fillStyle = frameConfig.patternColor
  ctx.lineWidth = frameThickness
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
  ctx.shadowBlur = 5

  // Draw frame based on pattern type
  switch (frameConfig.patternType) {
    case 'heart':
      // Draw heart pattern along the frame border with better spacing
      const heartSize = Math.min(frameWidth, frameHeight) * 0.015
      const heartSpacing = heartSize * 2.5
      
      // Top border
      for (let x = frameX + heartSpacing; x < frameX + frameWidth - heartSpacing; x += heartSpacing) {
        drawHeart(ctx, x, frameY + frameThickness / 2, heartSize)
      }
      // Bottom border
      for (let x = frameX + heartSpacing; x < frameX + frameWidth - heartSpacing; x += heartSpacing) {
        drawHeart(ctx, x, frameY + frameHeight - frameThickness / 2, heartSize)
      }
      // Left border
      for (let y = frameY + heartSpacing; y < frameY + frameHeight - heartSpacing; y += heartSpacing) {
        drawHeart(ctx, frameX + frameThickness / 2, y, heartSize)
      }
      // Right border
      for (let y = frameY + heartSpacing; y < frameY + frameHeight - heartSpacing; y += heartSpacing) {
        drawHeart(ctx, frameX + frameWidth - frameThickness / 2, y, heartSize)
      }
      // Add corner hearts
      drawHeart(ctx, frameX + frameThickness, frameY + frameThickness, heartSize * 1.2)
      drawHeart(ctx, frameX + frameWidth - frameThickness, frameY + frameThickness, heartSize * 1.2)
      drawHeart(ctx, frameX + frameThickness, frameY + frameHeight - frameThickness, heartSize * 1.2)
      drawHeart(ctx, frameX + frameWidth - frameThickness, frameY + frameHeight - frameThickness, heartSize * 1.2)
      break

    case 'star':
      const starSize = Math.min(frameWidth, frameHeight) * 0.018
      const starSpacing = starSize * 2.8
      
      // Top and bottom borders
      for (let x = frameX + starSpacing; x < frameX + frameWidth - starSpacing; x += starSpacing) {
        drawStar(ctx, x, frameY + frameThickness / 2, starSize, 5)
        drawStar(ctx, x, frameY + frameHeight - frameThickness / 2, starSize, 5)
      }
      // Left and right borders
      for (let y = frameY + starSpacing; y < frameY + frameHeight - starSpacing; y += starSpacing) {
        drawStar(ctx, frameX + frameThickness / 2, y, starSize, 5)
        drawStar(ctx, frameX + frameWidth - frameThickness / 2, y, starSize, 5)
      }
      // Add corner stars (larger)
      drawStar(ctx, frameX + frameThickness, frameY + frameThickness, starSize * 1.5, 5)
      drawStar(ctx, frameX + frameWidth - frameThickness, frameY + frameThickness, starSize * 1.5, 5)
      drawStar(ctx, frameX + frameThickness, frameY + frameHeight - frameThickness, starSize * 1.5, 5)
      drawStar(ctx, frameX + frameWidth - frameThickness, frameY + frameHeight - frameThickness, starSize * 1.5, 5)
      break

    case 'flower':
      const flowerSize = Math.min(frameWidth, frameHeight) * 0.015
      const flowerSpacing = flowerSize * 2.8
      
      // Top and bottom borders
      for (let x = frameX + flowerSpacing; x < frameX + frameWidth - flowerSpacing; x += flowerSpacing) {
        drawFlower(ctx, x, frameY + frameThickness / 2, flowerSize)
        drawFlower(ctx, x, frameY + frameHeight - frameThickness / 2, flowerSize)
      }
      // Left and right borders
      for (let y = frameY + flowerSpacing; y < frameY + frameHeight - flowerSpacing; y += flowerSpacing) {
        drawFlower(ctx, frameX + frameThickness / 2, y, flowerSize)
        drawFlower(ctx, frameX + frameWidth - frameThickness / 2, y, flowerSize)
      }
      // Add corner flowers (larger)
      drawFlower(ctx, frameX + frameThickness, frameY + frameThickness, flowerSize * 1.3)
      drawFlower(ctx, frameX + frameWidth - frameThickness, frameY + frameThickness, flowerSize * 1.3)
      drawFlower(ctx, frameX + frameThickness, frameY + frameHeight - frameThickness, flowerSize * 1.3)
      drawFlower(ctx, frameX + frameWidth - frameThickness, frameY + frameHeight - frameThickness, flowerSize * 1.3)
      break

    case 'simple':
    default:
      // Elegant decorative border with double lines
      ctx.strokeStyle = frameConfig.patternColor
      ctx.lineWidth = frameThickness * 0.6
      
      // Outer border
      ctx.strokeRect(frameX, frameY, frameWidth, frameHeight)
      
      // Inner border with offset
      const innerOffset = frameThickness * 0.8
      ctx.strokeRect(
        frameX + innerOffset,
        frameY + innerOffset,
        frameWidth - innerOffset * 2,
        frameHeight - innerOffset * 2
      )
      
      // Add elegant corner decorations
      const cornerSize = frameThickness * 2
      drawCornerDecoration(ctx, frameX, frameY, cornerSize)
      drawCornerDecoration(ctx, frameX + frameWidth, frameY, cornerSize)
      drawCornerDecoration(ctx, frameX, frameY + frameHeight, cornerSize)
      drawCornerDecoration(ctx, frameX + frameWidth, frameY + frameHeight, cornerSize)
      break
  }

  ctx.restore()
}

/**
 * Draw a small heart shape
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Size of heart
 */
function drawHeart(ctx, x, y, size) {
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, size / 4)
  ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 4)
  ctx.bezierCurveTo(-size / 2, size / 2, 0, size * 0.75, 0, size)
  ctx.bezierCurveTo(0, size * 0.75, size / 2, size / 2, size / 2, size / 4)
  ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

/**
 * Draw a star shape
 */
function drawStar(ctx, x, y, radius, spikes) {
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes
    const r = i % 2 === 0 ? radius : radius / 2
    const px = Math.cos(angle) * r
    const py = Math.sin(angle) * r
    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

/**
 * Draw a flower shape - improved design
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Size of flower
 */
function drawFlower(ctx, x, y, size) {
  ctx.save()
  ctx.translate(x, y)
  
  // Draw petals with gradient effect
  const petals = 5
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 * i) / petals
    const petalX = Math.cos(angle) * size * 0.35
    const petalY = Math.sin(angle) * size * 0.35
    
    // Draw petal with slight rotation
    ctx.save()
    ctx.translate(petalX, petalY)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.ellipse(0, 0, size * 0.25, size * 0.4, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  
  // Draw center with gradient
  const currentFill = ctx.fillStyle
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.2)
  gradient.addColorStop(0, '#FFD700')
  gradient.addColorStop(1, '#FFA500')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = currentFill // Restore
  ctx.restore()
}

/**
 * Draw corner decoration
 */
function drawCornerDecoration(ctx, x, y, size) {
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(size, 0)
  ctx.lineTo(0, size)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

/**
 * Frame Configuration - Beautiful combo designs
 * Each frame has: id, name, bgColor (background), patternColor, patternType, gradient (optional)
 */
export const FRAME_CONFIGS = [
  {
    id: 1,
    name: 'Romantic Hearts',
    bgColor: '#1a1a2e', // Dark navy background
    patternColor: '#ff6b9d', // Hot pink hearts
    patternType: 'heart',
    emoji: '💖',
    gradient: ['#1a1a2e', '#16213e'], // Optional gradient
    description: 'Dark romantic with pink hearts'
  },
  {
    id: 2,
    name: 'Starry Night',
    bgColor: '#0f172a', // Deep blue background
    patternColor: '#fbbf24', // Golden stars
    patternType: 'star',
    emoji: '⭐',
    gradient: ['#0f172a', '#1e293b'],
    description: 'Deep blue sky with golden stars'
  },
  {
    id: 3,
    name: 'Cherry Blossom',
    bgColor: '#fef3c7', // Soft yellow background
    patternColor: '#ec4899', // Pink flowers
    patternType: 'flower',
    emoji: '🌸',
    gradient: ['#fef3c7', '#fde68a'],
    description: 'Soft yellow with pink cherry blossoms'
  },
  {
    id: 4,
    name: 'Elegant Classic',
    bgColor: '#ffffff', // White background
    patternColor: '#8b5cf6', // Purple border
    patternType: 'simple',
    emoji: '✨',
    gradient: null,
    description: 'Clean white with purple accents'
  },
  {
    id: 5,
    name: 'Sunset Dreams',
    bgColor: '#fef2f2', // Light pink background
    patternColor: '#f59e0b', // Amber hearts
    patternType: 'heart',
    emoji: '🌅',
    gradient: ['#fef2f2', '#fee2e2'],
    description: 'Warm sunset with amber hearts'
  },
  {
    id: 6,
    name: 'Ocean Breeze',
    bgColor: '#e0f2fe', // Light blue background
    patternColor: '#06b6d4', // Cyan stars
    patternType: 'star',
    emoji: '🌊',
    gradient: ['#e0f2fe', '#bae6fd'],
    description: 'Fresh ocean blue with cyan stars'
  },
  {
    id: 7,
    name: 'Lavender Fields',
    bgColor: '#faf5ff', // Lavender background
    patternColor: '#a855f7', // Purple flowers
    patternType: 'flower',
    emoji: '💜',
    gradient: ['#faf5ff', '#f3e8ff'],
    description: 'Lavender with purple flowers'
  },
  {
    id: 8,
    name: 'Golden Hour',
    bgColor: '#fff7ed', // Cream background
    patternColor: '#ea580c', // Orange stars
    patternType: 'star',
    emoji: '🌞',
    gradient: ['#fff7ed', '#ffedd5'],
    description: 'Warm cream with orange stars'
  }
]

/**
 * Calculate optimal canvas size based on layout
 * @param {Array} layout - Layout array
 * @param {number} minPadding - Minimum padding for frame
 * @returns {Object} {width, height}
 */
function calculateOptimalCanvasSize(layout, minPadding = 30) {
  if (!layout || layout.length === 0) {
    return { width: 800, height: 600 }
  }

  // Find bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  
  layout.forEach(photo => {
    minX = Math.min(minX, photo.x)
    minY = Math.min(minY, photo.y)
    maxX = Math.max(maxX, photo.x + photo.w)
    maxY = Math.max(maxY, photo.y + photo.h)
  })

  // Add minimal padding for frame (reduced from 50 to 30)
  const width = maxX - minX + minPadding * 2
  const height = maxY - minY + minPadding * 2

  return { width, height, offsetX: minX - minPadding, offsetY: minY - minPadding }
}

/**
 * Apply layout and template frame to canvas
 * @param {HTMLCanvasElement} canvas
 * @param {number} photoCount - Number of photos (determines layout: 3=vertical, 4=square, 6=rectangle)
 * @param {number} templateId - Template ID for decorative frame (1-4)
 * @param {Array<string>} photos - Array of photo data URLs
 */
export async function applyLayoutAndTemplate(canvas, photoCount, templateId, photos) {
  const ctx = canvas.getContext('2d')
  
  // Get frame configuration
  const frameConfig = FRAME_CONFIGS.find(f => f.id === templateId) || FRAME_CONFIGS[0]
  
  // Use a base canvas size for initial layout calculation
  const baseWidth = 800
  const baseHeight = 600

  // Get initial layout grid based on photo count
  const initialLayout = getLayoutGrid(photoCount, baseWidth, baseHeight)

  // First, load all images to calculate their aspect ratios
  const images = []
  for (let i = 0; i < photos.length && i < initialLayout.length; i++) {
    try {
      const img = await loadImage(photos[i])
      images.push(img)
    } catch (error) {
      console.error(`Error loading photo ${i}:`, error)
      images.push(null)
    }
  }

  // Recalculate layout based on actual image aspect ratios
  const adaptedLayout = adaptLayoutToImages(initialLayout, images, baseWidth, baseHeight, photoCount)

  // Calculate optimal canvas size based on adapted layout
  const { width, height, offsetX, offsetY } = calculateOptimalCanvasSize(adaptedLayout)
  
  // Resize canvas to optimal size
  canvas.width = width
  canvas.height = height

  // Adjust layout coordinates relative to new canvas (centered)
  const adjustedLayout = adaptedLayout.map(photo => ({
    ...photo,
    x: photo.x - offsetX,
    y: photo.y - offsetY
  }))

  // Fill canvas with frame background (gradient or solid color)
  if (frameConfig.gradient && Array.isArray(frameConfig.gradient)) {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, frameConfig.gradient[0])
    gradient.addColorStop(1, frameConfig.gradient[1] || frameConfig.gradient[0])
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = frameConfig.bgColor
  }
  ctx.fillRect(0, 0, width, height)

  // Draw photos using adjusted layout - maintain aspect ratio, no distortion
  for (let i = 0; i < images.length && i < adjustedLayout.length; i++) {
    if (!images[i]) continue
    
    const img = images[i]
    const { x, y, w, h } = adjustedLayout[i]
    
      // Draw photo background (lighter shade)
      const borderRadius = 8 // Reduced from 15 to 8 for less rounded corners
      ctx.fillStyle = '#f5f5f5'
      drawRoundedRect(ctx, x, y, w, h, borderRadius)
      ctx.fill()
      
      // Draw photo with rounded corners - image fits perfectly in adapted box
      ctx.save()
      drawRoundedRect(ctx, x, y, w, h, borderRadius)
      ctx.clip()
      ctx.drawImage(img, x, y, w, h)
      ctx.restore()
      
      // Draw subtle border
      ctx.save()
      drawRoundedRect(ctx, x, y, w, h, borderRadius)
      ctx.strokeStyle = 'rgba(255, 182, 193, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
  }

  // Draw decorative frame around the layout with frame config
  drawDecorativeFrame(ctx, adjustedLayout, frameConfig)
}

// Legacy function for backward compatibility
export async function applyTemplate(canvas, templateId, photos) {
  // Use photo count to determine layout
  const photoCount = photos.length
  await applyLayoutAndTemplate(canvas, photoCount, templateId, photos)
}
