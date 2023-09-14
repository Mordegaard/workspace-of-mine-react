import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { SocialController } from 'scripts/methods/social'

import NoImageIcon from 'assets/icons/no-image.svg'
import Events from 'scripts/methods/events'

/**
 * @param {SocialSource} source
 * @return {JSX.Element}
 * @constructor
 */
export function Item ({ source }) {
  const [ profilePictureUrl, setProfilePictureUrl ] = useState(null)

  const getProfilePicture = async () => {
    setProfilePictureUrl(await SocialController.sources.getProfilePicture(source.key))
  }

  const toggleHide = async () => {
    await SocialController.sources.update(source.key, { hidden: !source.hidden })
  }

  useEffect(() => {
    getProfilePicture()
  }, [])

  return <Container>
    <div className='row gx-3 align-items-center flex-nowrap'>
      <div className='col-auto'>
        {
          profilePictureUrl
            ? <Picture src={profilePictureUrl} alt={source.name} />
            : <PicturePlaceholder className='flexed'>
              <NoImageIcon />
            </PicturePlaceholder>
        }
      </div>
      <div className='col overflow-hidden'>
        <div className='text-truncate fw-bold'>
          { source.name }
        </div>
        <div className='text-truncate text-gray-500'>
          { source.description }
        </div>
      </div>
      <div className='col-auto flexed text-gray-400'>
        <button className='icon-button me-2' onClick={toggleHide}>
          {
            source.hidden
              ? <i className='bi bi-eye-slash-fill p-1' />
              : <i className='bi bi-eye-fill p-1' />
          }
        </button>
        <button className='icon-button danger' onClick={() => Events.trigger('dialog:sources:remove', source)}>
          <i className='bi bi-trash-fill p-1' />
        </button>
      </div>
    </div>
  </Container>
}

const Container = styled('div')`
  padding: 8px;
  border-radius: 8px;
  
  &:nth-child(odd) {
    background: rgba(var(--bs-primary-rgb), 0.1);
  }
`

const pictureStyles = css`
  min-width: 56px;
  height: 56px;
  border-radius: 8px;
`

const Picture = styled('img')`
  ${pictureStyles};
`

const PicturePlaceholder = styled('div')`
  ${pictureStyles};
  
  background: var(--bs-gray-200);
  color: white;
  
  svg {
    width: 42px;
    height: 42px;
  }
`