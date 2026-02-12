import React, { useEffect, useRef, useState } from 'react'

import { SourcesSelector } from 'scripts/components/Social/SourcesSelector'
import { Feed } from 'scripts/components/Social/Feed'
import SocialController from 'scripts/methods/social'
import { useCustomEvent } from 'scripts/methods/hooks'
import AbstractSource from 'scripts/methods/social/sources/AbstractSource'
import { BookmarksFeed } from 'scripts/components/Social/BookmarksFeed'
import SourceBookmarks from 'scripts/methods/social/sources/SourceBookmarks'
import { mergeClasses } from 'scripts/methods/helpers'
import { THREE_COLUMNS_MODE, TWO_COLUMNS_MODE } from 'scripts/methods/constants'

export function Social () {
  const [ sources, setSources ] = useState([])
  const [ selected, setSelected ] = useState(null)
  const [ layoutMode, setLayoutMode ] = useState(SocialController.posts.items.length)

  const ref = useRef()

  const getSources = () => {
    SocialController.sources.get().then(setSources)
  }

  useEffect(getSources, [])

  useCustomEvent('sources:updated', ({ detail: sources }) => {
    setSources(sources)

    const selectedKey = selected instanceof SourceBookmarks
      ? selected.source.key
      : selected.key

    if (!sources.find(({ key }) => key === selectedKey)) {
      setSelected(null)
    }
  }, [ selected ])

  useCustomEvent('sources:change', ({ detail: selected }) => setSelected(selected))

  useCustomEvent('posts:updated', () => {
    setLayoutMode(SocialController.posts.items.length)
  })

  useEffect(() => {
    SocialController.posts.isSelected = !!selected

    const boundingBox = ref.current.getBoundingClientRect()

    if (boundingBox.y < 0) {
      window.scrollTo({
        top: window.scrollY + boundingBox.y - 50,
        behavior: 'instant'
      })
    }
  }, [ selected ])

  return <div ref={ref} className={mergeClasses('row g-0', layoutMode === TWO_COLUMNS_MODE && 'px-lg-4 mx-3 mx-md-5')}>
    <SourcesSelector
      sources={sources}
      selected={selected}
      layoutMode={layoutMode}
      onSelect={source => {
        setSelected(source)

        if (source === selected) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }}
    />
    <div className={mergeClasses('col', layoutMode === THREE_COLUMNS_MODE && 'px-lg-4 mx-3 mx-md-5')}>
      {
        (selected == null || selected instanceof AbstractSource) && <Feed sources={sources} selected={selected} />
      }
      {
        selected instanceof SourceBookmarks && <BookmarksFeed selected={selected} />
      }
    </div>
  </div>
}