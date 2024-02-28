import React from 'react'

import { AccentColor } from 'scripts/components/TopBar/Settings/General/AccentColor'
import { BookmarksGrid } from 'scripts/components/TopBar/Settings/General/BookmarksGrid'
import { SocialLayout } from 'scripts/components/TopBar/Settings/General/SocialLayout'

export function General ({ settings, updateSettings }) {
  const components = [
    AccentColor,
    BookmarksGrid,
    SocialLayout
  ]

  return <div>
    {
      components.map((component, key) =>
        React.createElement(
          component,
          { settings, updateSettings, key }
        )
      )
    }
  </div>
}