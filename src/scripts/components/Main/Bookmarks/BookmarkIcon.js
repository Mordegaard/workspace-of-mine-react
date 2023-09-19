import React from 'react'

import styled from 'styled-components'

import { BOOKMARK_ICON_TYPE_SVG, BOOKMARK_ICON_TYPE_URL } from 'scripts/methods/bookmarks/constants'
import { mergeClasses } from 'scripts/methods/helpers'

export function BookmarkIcon ({ bookmark }) {
  switch (bookmark.icon?.type) {
    case BOOKMARK_ICON_TYPE_URL:
      return <ImageIcon src={bookmark.icon.data} alt={bookmark.name} />
    case BOOKMARK_ICON_TYPE_SVG:
      return <SvgIcon className={mergeClasses('bi', bookmark.icon.data)} />
    default:
      return <ImageIcon src={`https://s2.googleusercontent.com/s2/favicons?sz=128&domain=${bookmark.url}`} alt={bookmark.name} />
  }
}

const SIZE = 48

const ImageIcon = styled('img').attrs(({ $url }) => ({
  style: {
    backgroundImage: `url("${$url}")`
  }
}))`
  width: ${SIZE}px;
  height: ${SIZE}px;
  background: 50% 50% / contain;
`

const SvgIcon = styled('i')`
  width: ${SIZE}px;
  height: ${SIZE}px;
`