import React, { useEffect, useRef, useState } from 'react'

import styled from 'styled-components'

export function Spoiler ({ children, visible: initialVisible = false, onChange }) {
  const [ visible, setVisible ] = useState(initialVisible)

  const ref = useRef()

  useEffect(() => {
    ref.current.style.maxHeight = visible
      ? ref.current.firstElementChild.clientHeight + 'px'
      : 0
  }, [ visible ])

  useEffect(() => {
    setVisible(initialVisible)
  }, [ initialVisible ])

  function updateVisible (value) {
    typeof onChange === 'function'
      ? onChange(value)
      : setVisible(value)
  }

  return <div>
    <SpoilerContent ref={ref} $visible={visible}>
      <div className='text-break'>
        { children }
      </div>
    </SpoilerContent>
    <div className='w-100 flexed mt-2'>
      <button className='btn btn-outline-primary btn-pill btn-sm' onClick={() => updateVisible(!visible)}>
        {
          visible
            ? <span><i className='bi bi-chevron-compact-up me-2' />Сховати</span>
            : <span><i className='bi bi-chevron-compact-down me-2' />Розгорнути</span>
        }
      </button>
    </div>
  </div>
}

const SpoilerContent = styled('div')`
  padding-left: 12px;
  border-left: 2px solid var(--bs-primary);
  overflow: hidden;
  transition: max-height 0.334s ease;
`