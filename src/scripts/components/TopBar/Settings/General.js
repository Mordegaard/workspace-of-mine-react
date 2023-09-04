import React from 'react'
import CacheManager from 'scripts/methods/cache'

export function General () {
  return <div>
    <button className='btn btn-danger' onClick={() => CacheManager.clear()}>
      Очистити кеш
    </button>
  </div>
}