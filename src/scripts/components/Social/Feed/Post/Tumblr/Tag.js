import React from 'react'

function TagBase ({ children, post }) {
  const tag = String(children)

  const sum = tag
    .split('')
    .map(letter => letter.charCodeAt(0))
    .reduce((a, b) => a + b, 0)

  const backgroundColor = COLORS[sum % COLORS.length]

  return <a href={`https://${post.source.key}.tumblr.com/tagged/${tag}`} target='_blank' rel='noreferrer'>
    <div className='badge' style={{ backgroundColor }}>
      #{ tag }
    </div>
  </a>
}

export const Tag = React.memo(TagBase)

const COLORS = [
  '#ff9500',
  '#e33161',
  '#e02e96',
  '#8930d6',
  '#0080ff',
  '#3edbd6',
  '#26de83',
  '#9ad03d',

]