import React from 'react'

import { randomColor } from 'scripts/methods/colors/randomizers'

function TagBase ({ children, post }) {
  const tag             = String(children)
  const backgroundColor = randomColor(tag)

  return <a href={`https://${post.source.key}.tumblr.com/tagged/${tag}`} target='_blank' rel='noreferrer'>
    <div className='badge' style={{ backgroundColor }}>
      #{ tag }
    </div>
  </a>
}

export const Tag = React.memo(TagBase)