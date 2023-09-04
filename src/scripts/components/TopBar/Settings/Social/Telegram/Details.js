import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { TelegramManager } from 'scripts/methods/telegram'

export function Details ({ me = {}, onLogout }) {
  const [ profilePicture, setProfilePicture ] = useState(null)

  useEffect(() => {
    TelegramManager.getProfilePicture().then(setProfilePicture)
  }, [])

  return <div className='mt-3'>
    <div className='text-center'>
      Ви увійшли як
      <br />
      {
        profilePicture && <ProfilePicture src={profilePicture} alt='Profile picture' className='me-1' />
      }
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

const ProfilePicture = styled('img')`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--bs-pastel-gray-200);
`