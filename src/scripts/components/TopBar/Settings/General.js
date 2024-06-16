import React from 'react'

import { AccentColor } from 'scripts/components/TopBar/Settings/General/AccentColor'
import { BookmarksGrid } from 'scripts/components/TopBar/Settings/General/BookmarksGrid'
import { SettingsContainer } from 'scripts/components/TopBar/Settings/SettingsContainer'
import { ThemeSelector } from 'scripts/components/TopBar/Settings/General/ThemeSelector'

export function General ({ settings, updateSettings }) {
  return <SettingsContainer
    settings={settings}
    updateSettings={updateSettings}
    components={components}
  />
}

General.ROUTE_NAME = 'Загальні налаштування'

const components = [
  ThemeSelector,
  BookmarksGrid,
  AccentColor,
]