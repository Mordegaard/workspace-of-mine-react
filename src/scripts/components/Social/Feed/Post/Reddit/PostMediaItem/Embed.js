import React from 'react'

import styled from 'styled-components'

import { Placeholder } from 'scripts/components/ui/Placeholder'
import { withTrigger } from 'scripts/methods/withComponent'
import { Modal } from 'scripts/components/ui/Modal'

/**
 * @param {PostMedia} media
 * @param {boolean} interactive
 * @return {JSX.Element}
 * @constructor
 */
export function Embed ({ media, interactive }) {
  if (!interactive) {
    return <IframeContainer>
      <iframe src={media.data.url} width={media.width} height={media.height} />
    </IframeContainer>
  }

  return <EmbedModal
    media={media}
    trigger={
      <Placeholder $thumbUrl={media.data.thumbnail} className='flexed'>
        <button className='btn btn-outline-white btn-pill'>
          <i className='bi bi-play-btn me-2 lh-0' />
          Відтворити iFrame
        </button>
      </Placeholder>
    }
  />
}

function EmbedModalBase ({ media, onClose }) {
  return <Modal title='Медіа-iFrame' onClose={onClose}>
    <iframe src={media.data.url} width={media.width} height={media.height} />
  </Modal>
}

const EmbedModal = withTrigger(EmbedModalBase)

const IframeContainer = styled('div')`
  min-width: 100%;
  position: relative;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`