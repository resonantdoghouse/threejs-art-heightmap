export interface HeightmapOptions {
  smoothing: number // 0 to 1 range preferably, or radius
  contrast: number // -100 to 100
  invert: boolean
}

export async function generateHeightmap(id: number | string, options: HeightmapOptions): Promise<string> {
  const imgObj = document.createElement('img')
  imgObj.src = `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`
  imgObj.crossOrigin = 'Anonymous'
  
  return new Promise((resolve, reject) => {
    imgObj.onload = () => {
      try {
        const heightmap = processImage(imgObj, options)
        resolve(heightmap)
      } catch (err) {
        reject(err)
      }
    }
    imgObj.onerror = (err) => reject(err)
  })
}

// Keep legacy support if needed, or just remove
export async function convertBW(id: number | string): Promise<string> {
    return generateHeightmap(id, { smoothing: 0, contrast: 0, invert: false })
}

function processImage(imgObj: HTMLImageElement, options: HeightmapOptions): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2d context')

  const width = imgObj.width
  const height = imgObj.height
  canvas.width = width
  canvas.height = height
  
  ctx.drawImage(imgObj, 0, 0)
  const imgPixels = ctx.getImageData(0, 0, width, height)
  const { data } = imgPixels
  
  // 1. Grayscale Conversion
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) // Luminance
    data[i] = avg
    data[i + 1] = avg
    data[i + 2] = avg
  }

  // 2. Contrast
  if (options.contrast !== 0) {
    const factor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast))
    for (let i = 0; i < data.length; i += 4) {
      let val = data[i]
      val = factor * (val - 128) + 128
      val = Math.max(0, Math.min(255, val))
      data[i] = val
      data[i + 1] = val
      data[i + 2] = val
    }
  }

  // 3. Invert
  if (options.invert) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }
  }

  ctx.putImageData(imgPixels, 0, 0)

  // 4. Smoothing (using canvas filter if available, or stackblur approach. 
  // Native context 2d filter 'blur()' is widely supported now)
  if (options.smoothing > 0) {
      // We need to draw the current data back, apply blur, then get it again?
      // Or just apply filter and redraw.
      // Easiest is to set context filter and draw the canvas onto itself.
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = width
      tempCanvas.height = height
      const tempCtx = tempCanvas.getContext('2d')!
      tempCtx.putImageData(imgPixels, 0, 0)
      
      ctx.filter = `blur(${options.smoothing}px)`
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(tempCanvas, 0, 0)
      ctx.filter = 'none' // reset
  }

  return canvas.toDataURL()
}
