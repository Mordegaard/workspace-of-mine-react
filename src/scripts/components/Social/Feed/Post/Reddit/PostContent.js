import React, { useState } from 'react'

import { Anchor } from 'scripts/components/ui/Anchor'
import { Spoiler } from 'scripts/components/Social/Feed/Post/Spoiler'

export function PostContent ({ post }) {
  const [ visible, setVisible ] = useState(post.originalPost.selftext?.length < TEXT_THRESHOLD)

  return <>
    <div className='h5'>
      <Anchor href={post.url}>
        { post.title }
      </Anchor>
    </div>
    {
      post.text && <Spoiler visible={visible} onChange={setVisible}>
        {
          post.text
        }
      </Spoiler>
    }
  </>
}

const TEXT_THRESHOLD = 256