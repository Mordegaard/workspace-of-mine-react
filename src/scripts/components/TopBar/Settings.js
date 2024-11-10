import React, { useState } from 'react'

import SettingsManager from 'scripts/methods/settings'
import { Breadcrumbs } from 'scripts/components/TopBar/Settings/Breadcrumbs'
import { withTrigger } from 'scripts/methods/factories'
import { Modal } from 'scripts/components/ui/Modal'
import { General } from 'scripts/components/TopBar/Settings/General'
import { Wallpaper } from 'scripts/components/TopBar/Settings/Wallpaper'
import { Social } from 'scripts/components/TopBar/Settings/Social'
import { Memory } from 'scripts/components/TopBar/Settings/Memory'
import { Telegram } from 'scripts/components/TopBar/Settings/Social/Telegram'
import { Layout } from 'scripts/components/TopBar/Settings/Social/Layout'
import { GridSelector } from 'scripts/components/TopBar/Settings/General/BookmarksGrid/GridSelector'

function SettingsBase ({ onClose }) {
  const [ route, setRoute ] = useState('general')
  const [ settings, setSettings ] = useState(SettingsManager.get())

  const updateSettings = async (key, value) => {
    SettingsManager.set(key, value)
    setSettings({ ...settings, [key]: value })
  }

  return <Modal scrollable={false} onClose={onClose}>
    <Breadcrumbs
      route={route}
      map={MAP}
      onRouteUpdate={setRoute}
      settings={settings}
      updateSettings={updateSettings}
    />
  </Modal>
}

export const Settings = withTrigger(SettingsBase)

/**
 * @type {Object<string, RouteItem>}
 */
const MAP = {
  general: {
    component: General,
    icon: 'sliders',
    children: {
      grid_selector: {
        component: GridSelector,
      }
    }
  },
  wallpaper: {
    component: Wallpaper,
    icon: 'image'
  },
  social: {
    component: Social,
    icon: 'layout-three-columns',
    children: {
      layout: {
        component: Layout
      },
      telegram: {
        component: Telegram,
      }
    }
  },
  memory: {
    component: Memory,
    icon: 'database-down'
  }
}