import React, { useEffect, useRef, useState } from 'react'

import styled from 'styled-components'

export function Spoiler ({ children }) {
  const [ visible, setVisible ] = useState(false)

  const ref = useRef()

  useEffect(() => {
    ref.current.style.maxHeight = visible
      ? ref.current.firstElementChild.clientHeight + 'px'
      : 0
  }, [ visible ])

  return <div>
    <SpoilerContent ref={ref} $visible={visible}>
      <div className='text-break'>
        { children }
      </div>
    </SpoilerContent>
    <div className='w-100 flexed mt-2'>
      <button className='btn btn-outline-secondary btn-pill btn-sm' onClick={() => setVisible(!visible)}>
        { visible ? 'Сховати' : 'Розгорнути' }
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