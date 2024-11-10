import React from 'react'

import { useBreadcrumbs } from 'scripts/methods/hooks/breadcrumbs'

export function BookmarksGrid ({ settings }) {
  const { router } = useBreadcrumbs()

  return <div className='row g-0 align-items-center mb-2'>
    <div className='col'>
      Сітка закладок
    </div>
    <div className='col-auto'>
      <button className='btn btn-sm btn-primary' onClick={() => router.to('grid_selector')}>
        { settings.layout.bookmarks_grid.rows }x{ settings.layout.bookmarks_grid.columns }
      </button>
    </div>
  </div>
}