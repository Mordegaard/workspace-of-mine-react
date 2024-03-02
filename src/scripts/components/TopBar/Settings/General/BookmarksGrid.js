import React from 'react'

import { Grid } from 'scripts/components/TopBar/Settings/General/BookmarksGrid/Grid'

export function BookmarksGrid ({ settings, updateSettings }) {
  return <div className='row g-0 align-items-center'>
    <div className='col'>
      Сітка закладок
    </div>
    <div className='col-auto'>
      <Grid
        settings={settings}
        updateSettings={updateSettings}
        trigger={
          <button className='btn btn-primary'>
            { settings.bookmarks_grid.rows }x{ settings.bookmarks_grid.columns }
          </button>
        }
      />
    </div>
  </div>
}