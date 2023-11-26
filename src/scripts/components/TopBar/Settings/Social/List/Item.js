import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { SocialController } from 'scripts/methods/social'
import { Tooltip } from 'scripts/components/ui/Tooltip'
import Events from 'scripts/methods/events'

import NoImageIcon from 'assets/icons/no-image.svg'

/**
 * @param {AbstractSource} source
 * @return {JSX.Element}
 * @constructor
 */
export function Item ({ source }) {
  const [ profilePictureUrl, setProfilePictureUrl ] = useState(null)

  const fetchProfilePicture = async () => {
    setProfilePictureUrl(await source.fetchProfilePicture())
  }

  const toggleHide = async () => {
    await SocialController.sources.update(source.key, { hidden: !source.hidden })
  }

  useEffect(() => {
    fetchProfilePicture()
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
        <a href={source.url} target='_blank' rel='noreferrer' className='text-truncate text-black fw-bold'>
          { source.name }
        </a>
        <div className='text-truncate text-gray-500'>
          { source.description }
        </div>
      </div>
      <div className='col-auto flexed text-secondary'>
        <Tooltip content={source.hidden ? 'Показувати пости у Всіх джерелах' : 'Приховувати пости у Всіх джерелах'}>
          <button className='icon-button me-2' onClick={toggleHide}>
            {
              source.hidden
                ? <i className='bi bi-eye-slash p-1' />
                : <i className='bi bi-eye p-1' />
            }
          </button>
        </Tooltip>
        <Tooltip content='Видалити джерело'>
          <button className='icon-button danger' onClick={() => Events.trigger('dialog:sources:remove', source)}>
            <i className='bi bi-trash p-1' />
          </button>
        </Tooltip>
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