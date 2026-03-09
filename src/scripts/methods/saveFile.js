export function saveFile (blob, fileName) {
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')

  link.href = url
  link.download = fileName

  document.body.appendChild(link)
  link.click()

  link.parentNode.removeChild(link)
  URL.revokeObjectURL(url)
}