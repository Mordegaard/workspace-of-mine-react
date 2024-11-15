import React from 'react'

import styled from 'styled-components'

import NotificationManager from 'scripts/methods/notificationManager'
import { ImageFileInput } from 'scripts/components/ui/Input'
import { handleInputValue } from 'scripts/methods/handlers'
import { DEFAULT_SETTINGS } from 'scripts/methods/constants'

import PexelsIcon from 'assets/icons/pexels.svg'

export function Wallpaper ({ settings, updateSettings }) {
  return <div>
    <div className='row g-0 mt-2'>
      <div className='col'>
        Імпортувати шпалери з файлу
      </div>
      <div className='col-auto'>
        <ImageFileInput
          onChange={file => {
            importWallpaper(file, base64 => {
              updateSettings('wallpaper.value', base64)
            })
          }}
        />
      </div>
    </div>
    <div className='row g-0'>
      <div className='col'>
        Використовувати випадкові шпалери від&nbsp;
        <b className='d-inline-flex'>
          <Pexels className='flexed'><PexelsIcon /></Pexels>
          &nbsp;Pexels
        </b>
      </div>
      <div className='col-auto'>
        <div className='form-check form-switch'>
          <input
            checked={settings.wallpaper.fetch ?? false}
            className='form-check-input'
            type='checkbox'
            role='switch'
            onChange={({ target }) => {
              updateSettings('wallpaper.fetch', target.checked)
            }}
          />
        </div>
      </div>
    </div>
    <div className='row g-0'>
      <div className='col'>
        Затемнювати шпалери з&nbsp;
        <SmallInput
          value={settings.darken_wallpaper.start ?? ''}
          placeholder={DEFAULT_SETTINGS.darken_wallpaper.start}
          onChange={handleInputValue(value => updateSettings('darken_wallpaper.start', value === '' ? null : parseInt(value)))}
        />
        &nbsp;до &nbsp;
        <SmallInput
          value={settings.darken_wallpaper.end ?? ''}
          placeholder={DEFAULT_SETTINGS.darken_wallpaper.end}
          onChange={handleInputValue(value => updateSettings('darken_wallpaper.end', value === '' ? null : parseInt(value)))}
        />
        &nbsp;години
      </div>
      <div className='col-auto'>
        <div className='form-check form-switch'>
          <input
            checked={settings.darken_wallpaper.value ?? false}
            className='form-check-input'
            type='checkbox'
            role='switch'
            onChange={({ target }) => {
              updateSettings('darken_wallpaper.value', target.checked)
            }}
          />
        </div>
      </div>
    </div>
    {
      settings.wallpaper.value && <div className='row g-0 mt-5'>
        <div className='col-12 text-center'>
          <span className='h6 fw-bold'>Імпортоване зображення</span>
        </div>
        <div className='col-12 flexed'>
          <WallpaperPreview src={settings.wallpaper.value} />
        </div>
      </div>
    }
  </div>
}

const saveWallpaper = async (canvas, onSave) => {
  const base64 = canvas.toDataURL('image/jpeg', 0.8)
  const imageSize = base64.length / 1024 / 1024

  if (imageSize > 1.5) {
    throw new Error('Image is too large')
  } else {
    await onSave(base64)
  }
}

const importWallpaper = (file, onSave) => {
  const img = new Image()

  img.onload = async () => {
    const canvas = document.createElement('canvas')

    canvas.width = img.width
    canvas.height = img.height

    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    try {
      await saveWallpaper(canvas, onSave)
    } catch (e) {
      try {
        NotificationManager.notify('Завеликий розмір файлу. Він буде відмасштабований до 1920x1080', NotificationManager.TYPE_INFO)

        canvas.width = 1920
        canvas.height = 1080

        const scale = Math.min(canvas.width / img.width, canvas.height / img.height)

        const w = img.width * scale
        const h = img.height * scale

        const x = (canvas.width - w) / 2
        const y = (canvas.height - h) / 2

        ctx.drawImage(img, x, y, w, h)

        await saveWallpaper(canvas, onSave)
      } catch (e) {
        console.error(e)
        NotificationManager.notify('Неможливо зберегти файл', NotificationManager.TYPE_INFO)
      }
    } finally {
      URL.revokeObjectURL(img.src)
    }
  }

  img.onerror = () => {
    NotificationManager.notify('Неможливо зберегти файл', NotificationManager.TYPE_INFO)
  }

  img.src = URL.createObjectURL(file)
}

Wallpaper.ROUTE_NAME = 'Шпалери'

const WallpaperPreview = styled('img')`
  width: 85%;
  border-radius: 18px;
`

const Pexels = styled('div')`
  width: 24px;
  height: 24px;
  color: white;
  border-radius: 4px;
  background: var(--bs-pexels);
  
  svg {
    height: 16px;
  }
`

const SmallInput = styled('input').attrs(({ type: 'number', className: 'simple', min: 0, max: 23 }))`
  width: 48px;
`