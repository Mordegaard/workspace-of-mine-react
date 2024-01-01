import React from 'react'

import { RoundButton } from 'scripts/components/Social/SourcesSelector/RoundButton'
import Events from 'scripts/methods/events'

export function AddSourceButton () {
  return <RoundButton onClick={() => Events.trigger('dialog:sources:add')}>
    <i className='bi bi-plus-lg' />
  </RoundButton>
}