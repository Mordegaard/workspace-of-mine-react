import React, { useEffect, useRef } from 'react'

import styled from 'styled-components'

import { Settings } from 'scripts/methods/storage'
import { SocialController } from 'scripts/methods/social'
import { random } from 'scripts/methods/helpers'
import { formatHSL } from 'scripts/methods/colors'
import CacheManager from 'scripts/methods/cache'
import Events from 'scripts/methods/events'
import { useCustomEvent } from 'scripts/methods/hooks'

export function WallpaperHandler () {
  const ref = useRef()

  const initWallpaper = async () => {
    const doFetchWallpaper = await Settings.get('fetch_wallpaper', false)

    doFetchWallpaper
      ? fetchWallpaper()
      : loadWallpaper()
  }

  const fetchWallpaper = async () => {
    let data = await CacheManager.get('posts/reddit/wallpaper', 'json')

    if (!data) {
      ({ data } = await SocialController.posts.reddit.get(`/r/wallpaper/hot.json`, { limit: 10 }))

      await CacheManager.put('posts/reddit/wallpaper', JSON.stringify(data))
    }

    const post = data.children[random(0, data.children.length)].data
    const formattedPost = SocialController.posts.reddit.formatPost(post)
    const media = formattedPost.media[random(0, formattedPost.media.length)]

    setUrlWallpaper(media.thumbnail, true)

    const img = new Image()

    img.onload = setUrlWallpaper.bind(null, media.fullSizeUrl, false)

    img.src = media.fullSizeUrl

    Events.trigger('wallpaper:loaded', post)
  }

  const loadWallpaper = async () => {
    const wallpaper = await Settings.get('wallpaper', null)

    if (wallpaper) {
      setUrlWallpaper(wallpaper)
    } else {
      const start = random(360)
      ref.current.style.background = `fixed linear-gradient(45deg, ${formatHSL([start, 100, 50])}, ${formatHSL([start + 36, 100, 50])})`
    }

    Events.trigger('wallpaper:loaded', null)
  }

  const setUrlWallpaper = (url, blur = false) => {
    ref.current.style.background = `50% 50% / cover url("${url}")`

    if (blur) {
      ref.current.style.filter = 'blur(6px)'
    } else {
      ref.current.style.filter = ''
    }
  }

  useCustomEvent('wallpaper:update', initWallpaper)

  useEffect(() => {
    initWallpaper()
  }, [])

  return <WallpaperContainer ref={ref} />
}

const WallpaperContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`