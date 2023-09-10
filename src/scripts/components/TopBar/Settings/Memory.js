import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import CacheManager from 'scripts/methods/cache'

export function Memory () {
  const [ storage, setStorage ] = useState({})

  const renderMemory = (value) => {
    return `${Number(value / 1024 / 1024).toFixed(2)}MB`
  }

  const clearCache = async () => {
    await CacheManager.clear()

    const newStorage = { ...storage }

    newStorage.usage -= newStorage.usageDetails.caches
    newStorage.usageDetails.caches = 0

    setStorage(newStorage)
  }

  useEffect(() => {
    navigator.storage.estimate().then(setStorage)
  }, [])

  return <div>
    <Row className='row g-0 align-items-center px-2 py-1'>
      <div className='col'>
        <b>Загалом використано</b>
      </div>
      <div className='col-auto'>
        <span className='badge bg-secondary'>
          { renderMemory(storage.usage) }
        </span>
      </div>
    </Row>
    <Row className='row g-0 align-items-center px-2 py-1'>
      <div className='col'>
        Кеш
      </div>
      <div className='col-auto'>
        <span className='badge bg-gray-300'>
          { renderMemory(storage.usageDetails?.caches) }
        </span>
      </div>
    </Row>
    <Row className='row g-0 align-items-center px-2 py-1'>
      <div className='col'>
        Service Worker
      </div>
      <div className='col-auto'>
        <span className='badge bg-gray-300'>
          { renderMemory(storage.usageDetails?.serviceWorkerRegistrations) }
        </span>
      </div>
    </Row>
    <div className='flexed mt-3'>
      <button className='btn btn-danger' onClick={clearCache}>
        Очистити кеш
      </button>
    </div>
  </div>
}

const Row = styled('div')`
  &:nth-child(odd) {
    background-color: #e0e0e0;
    border-radius: 8px;
  }
`