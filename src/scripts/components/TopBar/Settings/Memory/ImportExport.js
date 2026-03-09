import React from 'react'

import { withTrigger } from 'scripts/methods/factories'
import { Modal } from 'scripts/components/ui/Modal'
import Storage from 'scripts/methods/storage'
import { saveFile } from 'scripts/methods/saveFile'
import { FileInput } from 'scripts/components/ui/Input'

export function ImportExport (props = {}) {
  const importData = async (file) => {
    if (!(file instanceof File)) return

    const reader = new FileReader()

    reader.onload = (e) => {
      const data = JSON.parse(e.target.result)
      Storage.local.instance.set(data)
      window.location.reload()
    }

    reader.readAsText(file)
  }

  const exportData = async () => {
    const data = await Storage.local.instance.get()

    const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' })

    saveFile(blob, 'workspace-of-mine.json')
  }

  return <div {...props}>
    <div className='row'>
      <div className='col-6'>
        <ImportDialog
          trigger={
            <button className='btn btn-outline-primary w-100'>
              <i className='bi bi-cloud-upload me-2' />
              Імпортувати дані
            </button>
          }
          onConfirm={importData}
        />
      </div>
      <div className='col-6'>
        <button className='btn btn-outline-primary w-100' onClick={exportData}>
          <i className='bi bi-cloud-download me-2' />
          Експортувати дані
        </button>
      </div>
    </div>
  </div>
}

const ImportDialog = withTrigger(({ onConfirm, onClose }) => {
  return <Modal title='Імпортувати дані' onClose={onClose}>
    <div>Усі закладки, джерела та налаштування будуть перезаписані!</div>
    <div className='w-100 flexed mt-2 mb-1'>
      <FileInput
        className='btn btn-danger'
        onChange={(...params) => {
          onConfirm(...params)
          onClose()
        }}
      >
        Вибрати файл
      </FileInput>
    </div>
  </Modal>
})