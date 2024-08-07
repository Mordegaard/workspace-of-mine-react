export function blurImage (src, { size = 8, scale = 1 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = async () => {
      const canvas = new OffscreenCanvas(Math.floor(img.width * scale), Math.floor(img.height * scale))
      const ctx = canvas.getContext('2d')

      ctx.filter = `blur(${size}px)`

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.9 })

      resolve(URL.createObjectURL(blob))
    }

    img.onerror = reject

    img.src = src
  })
}