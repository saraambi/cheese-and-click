/**
 * Image Processing Utilities
 * Functions to apply filters and effects to images
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
 * Apply template frame to canvas
 * @param {HTMLCanvasElement} canvas
 * @param {number} templateId
 * @param {Array<string>} photos - Array of photo data URLs
 */
export async function applyTemplate(canvas, templateId, photos) {
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  // Clear canvas
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  // Template layouts
  const layouts = {
    1: { // Heart frame - 3 photos
      grid: [
        { x: width * 0.1, y: height * 0.1, w: width * 0.35, h: height * 0.35 },
        { x: width * 0.55, y: height * 0.1, w: width * 0.35, h: height * 0.35 },
        { x: width * 0.325, y: height * 0.5, w: width * 0.35, h: height * 0.35 }
      ]
    },
    2: { // Star frame - 4 photos
      grid: [
        { x: width * 0.05, y: height * 0.05, w: width * 0.42, h: height * 0.42 },
        { x: width * 0.53, y: height * 0.05, w: width * 0.42, h: height * 0.42 },
        { x: width * 0.05, y: height * 0.53, w: width * 0.42, h: height * 0.42 },
        { x: width * 0.53, y: height * 0.53, w: width * 0.42, h: height * 0.42 }
      ]
    },
    3: { // Flower frame - 6 photos
      grid: [
        { x: width * 0.05, y: height * 0.05, w: width * 0.28, h: height * 0.28 },
        { x: width * 0.36, y: height * 0.05, w: width * 0.28, h: height * 0.28 },
        { x: width * 0.67, y: height * 0.05, w: width * 0.28, h: height * 0.28 },
        { x: width * 0.05, y: height * 0.36, w: width * 0.28, h: height * 0.28 },
        { x: width * 0.36, y: height * 0.36, w: width * 0.28, h: height * 0.28 },
        { x: width * 0.67, y: height * 0.36, w: width * 0.28, h: height * 0.28 }
      ]
    },
    4: { // Simple frame - equal grid
      grid: photos.map((_, i) => {
        const cols = photos.length <= 3 ? photos.length : Math.ceil(Math.sqrt(photos.length))
        const rows = Math.ceil(photos.length / cols)
        const col = i % cols
        const row = Math.floor(i / cols)
        return {
          x: (width / cols) * col + width * 0.05,
          y: (height / rows) * row + height * 0.05,
          w: width / cols * 0.9,
          h: height / rows * 0.9
        }
      })
    }
  }

  const layout = layouts[templateId] || layouts[4]

  // Draw photos
  for (let i = 0; i < photos.length && i < layout.grid.length; i++) {
    try {
      const img = await loadImage(photos[i])
      const { x, y, w, h } = layout.grid[i]
      
      // Draw rounded rectangle background
      ctx.fillStyle = '#f0f0f0'
      drawRoundedRect(ctx, x - 5, y - 5, w + 10, h + 10, 15)
      ctx.fill()
      
      // Draw image
      ctx.save()
      drawRoundedRect(ctx, x, y, w, h, 10)
      ctx.clip()
      ctx.drawImage(img, x, y, w, h)
      ctx.restore()
    } catch (error) {
      console.error(`Error loading photo ${i}:`, error)
    }
  }
}
