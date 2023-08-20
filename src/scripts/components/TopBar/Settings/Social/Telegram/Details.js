import React from 'react'

export function Details ({ me = {}, onLogout }) {
  return <div>
    <div className='text-center'>
      Ви увійшли як <b>{ me.firstName }</b>
    </div>
  </div>
}