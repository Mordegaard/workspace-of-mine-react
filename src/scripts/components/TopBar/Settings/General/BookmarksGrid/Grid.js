import React, { useEffect, useState } from 'react'

import styled, { css } from 'styled-components'

import { withTrigger } from 'scripts/methods/factories'
import { Modal } from 'scripts/components/ui/Modal'
import Bookmarks from 'scripts/methods/bookmarks'
import { MAX_BOOKMARK_COLUMNS, MAX_BOOKMARK_ROWS } from 'scripts/methods/bookmarks/constants'

function GridBase ({ settings, updateSettings, onClose }) {
  const original = settings.bookmarks_grid

  const [ hovered, setHovered ] = useState({ rows: null, columns: null })
  const [ selected, setSelected ] = useState(original)
  const [ bookmarks, setBookmarks ] = useState([])

  const total = selected.rows * selected.columns
  const hasChanges = (selected.rows !== original.rows || selected.columns !== original.columns)

  function update () {
    updateSettings('bookmarks_grid', selected)
  }

  useEffect(() => {
    Bookmarks.get().then(setBookmarks)
  }, [])

  return <Modal title='Змінити сітку закладок' width='720px' onClose={onClose}>
    <div className='flexed'>
      <div onMouseLeave={setHovered.bind(null, { rows: null, columns: null })}>
        {
          Array.range(MAX_BOOKMARK_ROWS).map((_, rowIndex) =>
            <div key={rowIndex} className='lh-0'>
              {
                Array.range(MAX_BOOKMARK_COLUMNS).fill(null).map((_, colIndex) =>
                  <SquareContainer
                    key={rowIndex + colIndex}
                    onMouseEnter={setHovered.bind(null, { rows: rowIndex + 1, columns: colIndex + 1 })}
                  >
                    <Square
                      $hovered={
                        hovered.rows != null
                        && hovered.columns != null
                        && rowIndex + 1 <= hovered.rows
                        && colIndex + 1 <= hovered.columns
                      }
                      $selected={
                        selected.rows != null
                        && selected.columns != null
                        && rowIndex + 1 <= selected.rows
                        && colIndex + 1 <= selected.columns
                      }
                      onClick={setSelected.bind(null, { rows: rowIndex + 1, columns: colIndex + 1 })}
                    />
                  </SquareContainer>
                )
              }
            </div>
          )
        }
      </div>
    </div>
    <div className='text-center fs-6 mt-2'>
      <span className='text-gray-500'>
        { original.rows }x{ original.columns }
      </span>
      {
        hasChanges && <>
          <i className='bi bi-arrow-right px-2' />
          <span className='text-primary'>{ selected.rows }x{ selected.columns }</span>
        </>
      }
    </div>
    {
      total < bookmarks.length &&
      <div className='alert alert-warning d-flex' role='alert'>
        <i className='bi bi-exclamation-triangle me-2' />
        Ви створили { bookmarks.length } закладок, а сітка має { total } слотів. Зайві закладки буде приховано до появи вільних слотів.
      </div>
    }
    {
      hasChanges && <div className='w-100 flexed'>
        <button className='btn btn-primary mt-2' onClick={update}>
          Зберегти
        </button>
      </div>
    }
  </Modal>
}

export const Grid = withTrigger(GridBase)

const SQUARE_SIZE = 36

const getSquareStyles = (isSelected, isHovered) => {
  if (isHovered && isSelected) {
    return css`
      border-color: var(--bs-primary);
      background: rgba(var(--bs-primary-rgb), 0.5);
    `
  }

  if (isHovered) {
    return css`
      border-color: rgba(var(--bs-primary-rgb), 0.5);
      background: rgba(var(--bs-primary-rgb), 0.08);
    `
  }

  if (isSelected) {
    return css`
      border-color: var(--bs-primary);
      background: rgba(var(--bs-primary-rgb), 0.25);
    `
  }

  return ''
}

const SquareContainer = styled('div')`
  display: inline-flex;
  padding: 2px;
`

const Square = styled('button')`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: 2px solid #bbb;
  background: none;
  border-radius: 4px;
  
  ${({ $selected, $hovered }) => getSquareStyles($selected, $hovered) }
`