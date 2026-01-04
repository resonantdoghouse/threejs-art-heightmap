export async function convertBW(id: number | string): Promise<string> {
  const imgObj = document.createElement('img')
  imgObj.src = `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`
  imgObj.crossOrigin = 'Anonymous'
  
  return new Promise((resolve, reject) => {
    imgObj.onload = () => {
      try {
        const grayImage = gray(imgObj)
        resolve(grayImage)
      } catch (err) {
        reject(err)
      }
    }
    imgObj.onerror = (err) => reject(err)
  })
}

function gray(imgObj: HTMLImageElement): string {
  const canvas = document.createElement('canvas')
  const canvasContext = canvas.getContext('2d')
  if (!canvasContext) throw new Error('Could not get 2d context')

  const imgW = imgObj.width
  const imgH = imgObj.height
  canvas.width = imgW
  canvas.height = imgH
  
  canvasContext.drawImage(imgObj, 0, 0)
  const imgPixels = canvasContext.getImageData(0, 0, imgW, imgH)
  const { data, width, height } = imgPixels

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) << 2
      const avg = ((data[i] + data[i + 1] + data[i + 2]) / 3) | 0
      data[i] = avg
      data[i + 1] = avg
      data[i + 2] = avg
    }
  }

  canvasContext.putImageData(imgPixels, 0, 0)
  return canvas.toDataURL()
}
