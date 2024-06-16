import React from 'react'

import { LayoutSelector } from 'scripts/components/TopBar/Settings/General/LayoutSelector'
import { SettingsContainer } from 'scripts/components/TopBar/Settings/SettingsContainer'

export function Layout ({ settings, updateSettings }) {
  return <SettingsContainer
    settings={settings}
    updateSettings={updateSettings}
    components={components}
  />
}

Layout.ROUTE_NAME = 'Зовнішній вигляд'

const components = [
  LayoutSelector
]
