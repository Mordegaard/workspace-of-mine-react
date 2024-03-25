import React, { useState } from 'react'

import styled from 'styled-components'

import { withCustomEvent } from 'scripts/methods/factories'
import { Modal } from 'scripts/components/ui/Modal'
import { Input } from 'scripts/components/ui/Input'
import { BookmarksController } from 'scripts/methods/bookmarks'
import { Dropdown } from 'scripts/components/ui/Dropdown'
import { BOOKMARK_ICON_TYPE_IMPORTED, BOOKMARK_ICON_TYPE_URL } from 'scripts/methods/bookmarks/constants'
import { IconSelector } from 'scripts/components/Dialogs/EditBookmark/IconSelector'
import { ValidationMessage } from 'scripts/components/ui/ValidationMessage'

/**
 * @param {Bookmark} initialBookmark
 * @param {function} onClose
 * @return {JSX.Element}
 * @constructor
 */
function EditBookmarkBase ({ eventData: initialBookmark, onClose }) {
  const [ bookmark, setBookmark ] = useState(structuredClone(initialBookmark ?? {}))
  const [ errors, setErrors ] = useState({})

  const iconType = bookmark.icon?.type ?? null

  const updateBookmark = (values = {}) => {
    setBookmark({ ...bookmark, ...values })
  }

  const saveBookmark = async () => {
    let success

    if (initialBookmark) {
      success = await BookmarksController.update(initialBookmark.index, bookmark)
    } else {
      success = await BookmarksController.put(bookmark)
    }

    setErrors(BookmarksController.validator.errors)

    if (success) {
      onClose()
    }
  }

  return <Modal
    title={initialBookmark ? 'Змінити закладку' : 'Додати нову закладку'}
    onClose={onClose}
  >
    <InputContainer className='px-2 py-4'>
      <StyledInput
        color='var(--bs-primary-darker)'
        startIcon={ <i className='bi bi-fonts' />}
        error={errors['bookmark.name']}
        value={bookmark.name ?? ''}
        onChange={({ target }) => updateBookmark({ name: target.value })}
      >
        Назва закладки *
      </StyledInput>
    </InputContainer>
    <InputContainer className='px-2 py-4'>
      <StyledInput
        color='var(--bs-primary-darker)'
        startIcon={ <i className='bi bi-link-45deg' />}
        error={errors['bookmark.url']}
        value={bookmark.url ?? ''}
        onChange={({ target }) => updateBookmark({ url: target.value })}
      >
        Адреса закладки *
      </StyledInput>
    </InputContainer>
    <InputContainer className='p-2 pt-4'>
      <div className='row align-items-center'>
        <div className='col'>
          <IconSelector
            icon={bookmark.icon}
            onSelect={data => updateBookmark({ icon: { ...bookmark.icon, data } })}
          />
        </div>
        <div className='col-auto'>
          <Dropdown
            selected={iconType}
            items={
              [ null, BOOKMARK_ICON_TYPE_URL, BOOKMARK_ICON_TYPE_IMPORTED ].map(type => ({
                value: type,
                label: ICON_TYPE_DESCRIPTIONS[type]
              }))
            }
            onItemSelect={type => {
              updateBookmark({
                icon: { type, value: null }
              })
            }}
          >
            <button className='btn btn-basic-primary btn-sm text-primary-darker'>
              <i className='bi bi-image me-2' />
              { ICON_TYPE_DESCRIPTIONS[iconType] }
              <i className='bi bi-chevron-compact-down ms-1' />
            </button>
          </Dropdown>
        </div>
      </div>
    </InputContainer>
    <div className='w-100 row mt-3'>
      <div className='col' />
      <div className='col-auto'>
        <button className='btn btn-primary' onClick={saveBookmark}>
          { initialBookmark ? 'Змінити' : 'Додати' } закладку
        </button>
      </div>
      <div className='col'>
        <ValidationMessage errors={errors} property='bookmark' />
      </div>
    </div>
  </Modal>
}

const ICON_TYPE_DESCRIPTIONS = {
  null: 'Автоматично',
  [BOOKMARK_ICON_TYPE_IMPORTED]: 'З файла',
  [BOOKMARK_ICON_TYPE_URL]: 'За адресою'
}

const InputContainer = styled('div')`
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  border-radius: 8px;
  margin-left: 8px;
  margin-right: 8px;
  
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

const StyledInput = styled(Input)`
  width: 100%;
  min-width: 550px;
`

export const EditBookmark = withCustomEvent(EditBookmarkBase, 'bookmarks:edit')