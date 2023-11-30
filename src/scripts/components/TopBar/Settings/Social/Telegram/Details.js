import React from 'react'

import { ProfilePicture } from 'scripts/components/ui/Telegram/ProfilePicture'

export function Details ({ me = {}, onLogout }) {
  return <div className='mt-3'>
    <div className='text-center'>
      Ви увійшли як
      <br />
      <ProfilePicture alt='Profile picture' className='me-1' />
      <b>{ me.firstName }</b>
    </div>
    <div className='text-center'>
      <button className='btn btn-danger mt-3' onClick={onLogout}>
        <i className='bi bi-box-arrow-left me-2' />
        Вийти
      </button>
    </div>
  </div>
}