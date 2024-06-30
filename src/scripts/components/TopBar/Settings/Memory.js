import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import CacheManager from 'scripts/methods/cache'
import Settings from 'scripts/methods/settings'

export function Memory () {
  const [ storage, setStorage ] = useState({})

  const total = Object.values(storage).reduce((acc, value) => acc + value, 0)

  const renderMemory = (value) => {
    return `${Number((value ?? 0) / 1024 / 1024).toFixed(2)}MB`
  }

  const clearCache = async () => {
    await CacheManager.clear()

    const newStorage = { ...storage }
    newStorage.caches = 0

    setStorage(newStorage)
  }

  useEffect(() => {
    navigator.storage.estimate().then(async ({ usageDetails }) => {
      const wallpaper = await Settings.get('wallpaper.value', '')
      setStorage({ ...usageDetails, wallpaper: wallpaper.length })
    })
  }, [])

  return <div>
    <Row className='row g-0 align-items-center px-2 py-1'>
      <div className='col'>
        <b>Загалом використано</b>
      </div>
      <div className='col-auto'>
        <span className='badge bg-secondary'>
          { renderMemory(total) }
        </span>
      </div>
    </Row>
    <Row className='row g-0 align-items-center px-2 py-1'>
      <div className='col'>
        Кеш
      </div>
      <div className='col-auto'>
        <span className='badge bg-gray-300'>
          { renderMemory(storage.caches) }
        </span>
      </div>
    </Row>
    <Row className='row g-0 align-items-center px-2 py-1'>
      <div className='col'>
        Service Worker
      </div>
      <div className='col-auto'>
        <span className='badge bg-gray-300'>
          { renderMemory(storage.serviceWorkerRegistrations) }
        </span>
      </div>
    </Row>
    <Row className='row g-0 align-items-center px-2 py-1'>
      <div className='col'>
        Імпортовані шпалери
      </div>
      <div className='col-auto'>
        <span className='badge bg-gray-300'>
          { renderMemory(storage.wallpaper) }
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

Memory.ROUTE_NAME = 'Пам\'ять та дані'

const Row = styled('div')`
  &:nth-child(odd) {
    background-color: rgba(var(--bs-gray-500-rgb), 0.15);
    border-radius: 8px;
  }
`