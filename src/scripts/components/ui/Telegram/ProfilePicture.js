import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { TelegramManager } from 'scripts/methods/telegram'
import { randomColor } from 'scripts/methods/colors/randomizers'
import { hexToRgb, multiply, rgbToHex } from 'scripts/methods/colors'

export function ProfilePicture ({ userId = 'me', alt, ...props }) {
  const [ url, setUrl ] = useState(null)

  const color = randomColor(userId)

  useEffect(() => {
    let pictureUrl = ''

    if (userId != null) {
      TelegramManager.fetchProfilePicture(userId).then(src => {
        pictureUrl = src
        setUrl(src)
      })
    }

    return () => {
      URL.revokeObjectURL(pictureUrl)
    }
  }, [])

  return url
    ? <Picture src={url} alt={alt} {...props} />
    : <Placeholder $color={color} alt={alt} {...props}>
        <b className='lh-0'>{ alt[0] }</b>
      </Placeholder>
}

ProfilePicture.SIZE = 36

const styles = css`
  width: ${ProfilePicture.SIZE}px;
  height: ${ProfilePicture.SIZE}px;
  border-radius: 50%;
  background-color: var(--bs-gray-200);
`

const Picture = styled('img')`
  ${styles};

  max-width: ${ProfilePicture.SIZE}px;
  max-height: ${ProfilePicture.SIZE}px;
  color: transparent;
`

const Placeholder = styled('div').attrs(({ $color }) => ({
  className: 'flexed',
  style: {
    backgroundColor: $color,
    color: rgbToHex(multiply(hexToRgb($color), 0.5))
  }
}))`
  ${styles};
  
  display: inline-flex;
`