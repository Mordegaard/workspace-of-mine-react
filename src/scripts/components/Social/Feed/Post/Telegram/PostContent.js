import React from 'react'

import { Spoiler } from 'scripts/components/Social/Feed/Post/Spoiler'
import { SlicedText } from 'scripts/components/ui/SlicedText'

export function PostContent ({ post }) {
  const isTrimmed = post.title.length > SlicedText.DEFAULT_LIMIT

  return <div>
    <SlicedText>{ post.title }</SlicedText>
    {
      isTrimmed && <Spoiler>
        { post.title }
      </Spoiler>
    }
  </div>
}