import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { withCustomEvent } from 'scripts/methods/withComponent'
import { Modal } from 'scripts/components/ui/Modal'
import { Input } from 'scripts/components/ui/Input'
import { BookmarksController } from 'scripts/methods/bookmarks'
import { Dropdown } from 'scripts/components/ui/Dropdown'
import { BOOKMARK_ICON_TYPE_IMPORTED, BOOKMARK_ICON_TYPE_URL } from 'scripts/methods/bookmarks/constants'
import { IconSelector } from 'scripts/components/Dialogs/EditBookmark/IconSelector'

/**
 * @param {Bookmark} initialBookmark
 * @param {function} onClose
 * @return {JSX.Element}
 * @constructor
 */
function EditBookmarkBase ({ eventData: initialBookmark, onClose }) {
  const [ bookmark, setBookmark ] = useState(structuredClone(initialBookmark ?? {}))
  const [ iconType, setIconType ] = useState(bookmark?.icon?.type ?? null)
  const [ errors, setErrors ] = useState({})

  const updateBookmark = (key, value) => {
    setBookmark({ ...bookmark, [key]: value })
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

  useEffect(() => {
    updateBookmark('icon', null)
  }, [ iconType ])

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
        onChange={({ target }) => updateBookmark('name', target.value)}
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
        onChange={({ target }) => updateBookmark('url', target.value)}
      >
        Адреса закладки *
      </StyledInput>
    </InputContainer>
    <InputContainer className='p-2'>
      <Dropdown
        selected={iconType}
        items={
          [ null, BOOKMARK_ICON_TYPE_URL, BOOKMARK_ICON_TYPE_IMPORTED ].map(type => ({
            value: type,
            label: ICON_TYPE_DESCRIPTIONS[type]
          }))
        }
        onItemSelect={setIconType}
      >
        <button className='btn btn-primary'>
          { ICON_TYPE_DESCRIPTIONS[iconType] }
        </button>
      </Dropdown>
      <IconSelector type={iconType} onSelect={icon => updateBookmark('icon', icon)} />
    </InputContainer>
    <div className='w-100 flexed mt-3'>
      <button className='btn btn-primary' onClick={saveBookmark}>
        Додати закладку
      </button>
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
  width: 450px;
`

export const EditBookmark = withCustomEvent(EditBookmarkBase, 'bookmarks:edit')