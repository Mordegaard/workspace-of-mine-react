import React from 'react'

import styled from 'styled-components'

import { ImageFileInput } from 'scripts/components/ui/Input'

export function FileSelector ({ icon, onSelect }) {
  function importIcon (file) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = ICON_SIZE
    canvas.height = ICON_SIZE

    const img = new Image()

    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > height) {
        width = ICON_SIZE
        height = ICON_SIZE * img.height / img.width
      } else {
        height = ICON_SIZE
        width = ICON_SIZE * img.width / img.height
      }

      ctx.drawImage(img, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)

      const base64 = canvas.toDataURL('image/webp', 0.8)

      onSelect(base64)
    }

    img.src = URL.createObjectURL(file)
  }

  return <div className='d-flex'>
    <ImageFileInput onChange={importIcon} />
    <IconPreview $src={icon.data} className='ms-2' />
  </div>
}

const ICON_SIZE = 64

const IconPreview = styled('div').attrs(({ $src }) => ({
  style: {
    background: `50% 50% / contain url(${$src})`
  }
}))`
  width: 36px;
  height: 36px;
  border: 1px solid var(--bs-primary-darker);
`