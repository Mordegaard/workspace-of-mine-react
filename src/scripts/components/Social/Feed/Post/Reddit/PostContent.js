import React from 'react'

import { Anchor } from 'scripts/components/ui/Anchor'
import { Spoiler } from 'scripts/components/Social/Feed/Post/Spoiler'

export function PostContent ({ post }) {
  return <>
    <div className='h5'>
      <Anchor href={post.url}>
        { post.title }
      </Anchor>
    </div>
    {
      post.text && <Spoiler>
        {
          post.text
        }
      </Spoiler>
    }
  </>
}