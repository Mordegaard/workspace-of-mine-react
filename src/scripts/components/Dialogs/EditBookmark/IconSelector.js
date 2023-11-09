import React from 'react'
import {
  BOOKMARK_ICON_TYPE_IMPORTED,
  BOOKMARK_ICON_TYPE_SVG,
  BOOKMARK_ICON_TYPE_URL
} from 'scripts/methods/bookmarks/constants'
import { UrlSelector } from 'scripts/components/Dialogs/EditBookmark/IconSelector/UrlSelector'
import { FileSelector } from 'scripts/components/Dialogs/EditBookmark/IconSelector/FileSelector'

/**
 * @param {BookmarkIcon} icon
 * @param {function} onSelect
 * @return {JSX.Element|null}
 * @constructor
 */
export function IconSelector ({ icon, onSelect }) {
  switch (icon?.type) {
    case BOOKMARK_ICON_TYPE_URL:
      return <UrlSelector icon={icon} onSelect={onSelect} />
    case BOOKMARK_ICON_TYPE_IMPORTED:
      return <FileSelector icon={icon} onSelect={onSelect} />
    case BOOKMARK_ICON_TYPE_SVG:
      return null
  }

  return <span className='text-primary-darker text-opacity-75 fs-7'>
    <i className='bi bi-info-circle me-2' />
    Буде використана піктограма сайту, якщо можливо
  </span>
}