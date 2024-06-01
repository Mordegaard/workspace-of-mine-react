import React, { useState } from 'react'

import { mergeClasses } from 'scripts/methods/helpers'
import { Tooltip } from 'scripts/components/ui/Tooltip'

/**
 * @param {FormattedPost} post
 * @param props
 * @returns {React.JSX.Element}
 * @constructor
 */
export function PostBookmark ({ post, ...props }) {
  const [ added, setAdded ] = useState(post.source.bookmarks.ids.includes(post.id))

  async function toggle () {
    await post.source.bookmarks.toggle(post.id)
    setAdded(!added)
  }

  return <Tooltip content='Додати до соціальних закладок'>
    <button
      className={
        mergeClasses('btn btn-sm btn-round me-1', added ? 'btn-primary' : 'btn-basic-primary')
      }
      onClick={toggle}
      {...props}
    >
      <i className={mergeClasses('bi', added ? 'bi-bookmark-check' : 'bi-bookmark-plus')} />
    </button>
  </Tooltip>
}