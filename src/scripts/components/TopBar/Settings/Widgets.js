import React from 'react'
import { WIDGETS } from 'scripts/methods/widgets'
import { WidgetSettings } from 'scripts/components/TopBar/Settings/Widgets/WidgetSettings'

export function Widgets ({ settings, updateSettings }) {
  return <div>
    {
      Object.entries(WIDGETS).map(([ key, definition ]) =>
        <WidgetSettings
          key={key}
          widgetKey={key}
          definition={definition}
          settings={settings}
          updateSettings={updateSettings}
        />
      )
    }
  </div>
}

Widgets.ROUTE_NAME = 'Віджети'