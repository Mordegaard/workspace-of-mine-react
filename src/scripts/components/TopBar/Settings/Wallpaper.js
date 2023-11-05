import React from 'react'

import styled from 'styled-components'

import Events from 'scripts/methods/events'
import NotificationManager from 'scripts/methods/notificationManager'

import PexelsIcon from 'assets/icons/pexels.svg'

export function Wallpaper ({ settings, updateSettings }) {
  return <div>
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
            checked={settings.fetch_wallpaper ?? false}
            className='form-check-input'
            type='checkbox'
            role='switch'
            onChange={({ target }) => {
              updateSettings(
                'fetch_wallpaper',
                target.checked,
                () => Events.trigger('settings:wallpaper:update')
              )
            }}
          />
        </div>
      </div>
    </div>
    <div className='row g-0 mt-2'>
      <div className='col'>
        Імпортувати шпалери з файлу
      </div>
      <div className='col-auto'>
        <label className='btn btn-primary btn-sm'>
          <HiddenInput
            type='file'
            onInput={({ target }) => {
              const [ file ] = target.files

              importWallpaper(file, base64 => {
                updateSettings('wallpaper', base64)

                if (settings.fetch_wallpaper !== true) {
                  Events.trigger('settings:wallpaper:update')
                }
              })
            }}
          />
          <span>
            <i className='bi bi-upload me-2 lh-0' />
            Вибрати файл
          </span>
        </label>
      </div>
    </div>
    {
      settings.wallpaper && <div className='row g-0 mt-5'>
        <div className='col-12 text-center'>
          <span className='h6 fw-bold'>Імпортоване зображення</span>
        </div>
        <div className='col-12 flexed'>
          <WallpaperPreview src={settings.wallpaper} />
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
  const url = URL.createObjectURL(file)

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

        const x = canvas.width / 2 - w / 2
        const y = canvas.height / 2 - h / 2

        ctx.drawImage(img, x, y, w, h)

        await saveWallpaper(canvas, onSave)
      } catch (e) {
        console.error(e)
        NotificationManager.notify('Неможливо зберегти файл', NotificationManager.TYPE_INFO)
      }
    }
  }

  img.onerror = () => {
    NotificationManager.notify('Неможливо зберегти файл', NotificationManager.TYPE_INFO)
  }

  img.src = url
}

const HiddenInput = styled('input')`
  position: absolute;
  width: 0;
  height: 0;
  visibility: hidden;
`

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