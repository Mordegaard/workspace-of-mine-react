import React, { useState } from 'react'

import { SocialController } from 'scripts/methods/social'
import { mergeClasses } from 'scripts/methods/helpers'
import { Tooltip } from 'scripts/components/ui/Tooltip'

/**
 * @param {FormattedPost} post
 * @param props
 * @returns {React.JSX.Element}
 * @constructor
 */
export function PostBookmark ({ post, ...props }) {
  const [ added, setAdded ] = useState(SocialController.socialBookmarks.reddit.ids.includes(post.id))

  async function toggle () {
    await SocialController.socialBookmarks.reddit.toggle(post.id)
    setAdded(!added)
  }

  return <Tooltip content='Додати до соціальних закладок'>
    <button
      className={
        mergeClasses('btn btn-sm btn-round me-1 fs-7', added ? 'btn-primary' : 'btn-basic-primary')
      }
      onClick={toggle}
      {...props}
    >
      <i className={mergeClasses('bi', added ? 'bi-bookmark-check' : 'bi-bookmark-plus')} />
    </button>
  </Tooltip>
}