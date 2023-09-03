import React from 'react'
import { Spoiler } from 'scripts/components/Social/Feed/Post/Spoiler'

export function PostContent ({ post }) {
  const isTrimmed = post.title.length > TEXT_THRESHOLD
  const title = isTrimmed ? post.title.slice(0, TEXT_THRESHOLD).trim() + '...' : post.title

  return <div>
    <span>{ title }</span>
    {
      isTrimmed && <Spoiler>
        { post.title }
      </Spoiler>
    }
  </div>
}

const TEXT_THRESHOLD = 96