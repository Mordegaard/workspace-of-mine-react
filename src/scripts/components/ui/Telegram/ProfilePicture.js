import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { TelegramManager } from 'scripts/methods/telegram'

export function ProfilePicture ({ userId = 'me', ...props }) {
  const [ src, setSrc ] = useState(null)

  useEffect(() => {
    if (userId != null) {
      TelegramManager.fetchProfilePicture(userId).then(setSrc)
    }
  }, [])

  return src
    ? <Picture src={src} {...props} />
    : <Placeholder {...props} />
}

const SIZE = 36

const styles = css`
  width: ${SIZE}px;
  height: ${SIZE}px;
  border-radius: 50%;
  background-color: var(--bs-gray-200);
`

const Picture = styled('img')`
  ${styles};

  max-width: ${SIZE}px;
  max-height: ${SIZE}px;
  color: transparent;
`

const Placeholder = styled('div')`
  ${styles};

  display: inline-block;
  vertical-align: middle;
`