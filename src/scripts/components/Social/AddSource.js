import React, { useState } from 'react'

import styled from 'styled-components'

import { Modal } from 'scripts/components/ui/Modal'
import { withCustomEvent } from 'scripts/methods/withComponent'
import { SourceButton } from 'scripts/components/Social/AddSource/SourceButton'
import { SOURCE_REDDIT, SOURCE_TELEGRAM, SOURCE_TUMBLR, sourceDescriptions } from 'scripts/methods/social/constants'

function AddSourceBase ({ onClose }) {
  const [ selected, setSelected ] = useState(null)

  return <Modal withContainer={false} width='900px' onClose={onClose}>
    <Title>Виберіть джерело</Title>
    <Container className='position-relative'>
      {
        Object.entries(sourceDescriptions).map(([ key, data ]) =>
          <SourceButton
            key={key}
            data={{ key, ...data }}
            texts={TEXTS[key] ?? {}}
            selected={selected}
            onSelectedChange={setSelected}
          />
        )
      }
    </Container>
  </Modal>
}

export const AddSource = withCustomEvent(AddSourceBase, 'dialog:sources:add')

const TEXTS = {
  [SOURCE_REDDIT]: {
    label: 'Введіть назву субреддіта'
  },
  [SOURCE_TELEGRAM]: {
    label: <>Введіть <code>channelname</code> каналу або посилання на канал</>
  },
  [SOURCE_TUMBLR]: {
    label: <>Введіть <code>username</code> акаунта</>
  }
}

const Container = styled('div')`
  width: 800px;
  max-width: 90vw;
`

const Title = styled('h4')`
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  text-align: center;
`