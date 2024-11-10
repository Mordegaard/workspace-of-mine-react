import React from 'react'

import { SettingsContainer } from 'scripts/components/TopBar/Settings/SettingsContainer'
import { SourcesLayout } from 'scripts/components/TopBar/Settings/Social/Layout/SourcesLayout'
import { HiddenSourcesLayout } from 'scripts/components/TopBar/Settings/Social/Layout/HiddenSourcesLayout'

export function Layout ({ settings, updateSettings }) {
  return <SettingsContainer
    settings={settings}
    updateSettings={updateSettings}
    components={components}
  />
}

Layout.ROUTE_NAME = 'Зовнішній вигляд'

const components = [
  HiddenSourcesLayout,
  SourcesLayout
]
