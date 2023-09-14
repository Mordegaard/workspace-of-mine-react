import React from 'react'

import { withCustomEvent } from 'scripts/methods/withComponent'
import { Modal } from 'scripts/components/ui/Modal'
import { SocialController } from 'scripts/methods/social'

function DeleteSourceBase ({ eventData: source, onClose }) {
  const deleteSource = async () => {
    await SocialController.sources.remove(source.key)
    onClose()
  }

  return <Modal title='Видалити джерело' onClose={onClose}>
    <div>Ви впевнені, що хочете видалити джерело <b>{ source.name }</b>?</div>
    <div className='w-100 flexed mt-2 mb-1'>
      <button className='btn btn-danger' onClick={deleteSource}>Видалити</button>
    </div>
  </Modal>
}

export const DeleteSource = withCustomEvent(DeleteSourceBase, 'dialog:sources:remove')