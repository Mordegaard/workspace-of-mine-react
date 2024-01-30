import React, { useEffect, useState } from 'react'

import { addDays, set } from 'date-fns'

import styled, { css } from 'styled-components'

import Events from 'scripts/methods/events'
import Settings from 'scripts/methods/settings'
import { random } from 'scripts/methods/helpers'
import { formatHSL } from 'scripts/methods/colors'
import { useCustomEvent } from 'scripts/methods/hooks'
import { PexelsController } from 'scripts/methods/pexelsController'

export function WallpaperHandler () {
  const [ settings, setSettings ] = useState(Settings.get())

  const now = new Date()

  let startDarken = set(now, { hours: settings.darken_wallpaper.start, minutes: 0, seconds: 0, milliseconds: 0 })
  let endDarken =  set(now, { hours: settings.darken_wallpaper.end, minutes: 0, seconds: 0, milliseconds: 0 })

  if (settings.darken_wallpaper.start >= settings.darken_wallpaper.end) {
    endDarken = addDays(endDarken, 1)
  }

  const doDarken = settings.darken_wallpaper.value && now > startDarken && now < endDarken

  const initWallpaper = async () => {
    const settings = Settings.get()

    setSettings(settings)

      settings.wallpaper.fetch
      ? fetchWallpaper(settings)
      : loadWallpaper(settings)
  }

  useCustomEvent(
    ['settings:wallpaper.value:update', 'settings:wallpaper.fetch:update'],
    initWallpaper
  )

  useEffect(() => {
    initWallpaper()
  }, [])

  return <WallpaperContainer id='wallpaper_handler' $darken={doDarken} />
}

async function fetchWallpaper () {
  const photos = await PexelsController.search()

  const randomPhoto = photos.pickRandom()

  Events.trigger('wallpaper:fetched', randomPhoto)

  setUrlWallpaper(randomPhoto.src.tiny, true)

  const img = new Image()

  img.onload = () => setUrlWallpaper(img.src)

  img.src = randomPhoto.src.original
}

async function loadWallpaper (settings) {
  const element = document.getElementById('wallpaper_handler')
  const { value } = settings.wallpaper

  if (value) {
    setUrlWallpaper(value)
  } else {
    const start = random(360)
    element.style.background = `fixed linear-gradient(45deg, ${formatHSL([start, 100, 50])}, ${formatHSL([start + 36, 100, 50])})`
  }

  Events.trigger('wallpaper:fetched', null)
}

function setUrlWallpaper (url, blur = false) {
  const element = document.getElementById('wallpaper_handler')

  element.style.background = `50% 50% / cover url("${url}")`

  if (blur) {
    element.style.filter = ''
    element.style.transform = ''
  } else {
    element.style.filter = 'none'
    element.style.transform = 'none'
  }
}

const WallpaperContainer = styled('div')`
  background: 50% 50% / cover;
  filter: blur(10px);
  transform: scale(1.025);
  z-index: -1;
  pointer-events: none;
  transition: filter 1s ease, transform 1s ease;
  
  &, &:after {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw; // ignores scrollbar width
    height: 100%;
  }
  
  &:after {
    content: "";
    opacity: 0;
    transition: opacity 0.5s ease;
    background-color: black;
  }
  
  ${({ $darken }) => $darken && css`
    &:after {
      opacity: 0.6;
    }
  `}
`