import React from 'react'
import { useSettings } from 'scripts/methods/hooks'
import { WIDGETS } from 'scripts/methods/widgets'

export function Widgets () {
  const settings = useSettings()

  const widgets = settings.widgets ?? []

  return <>
    {
      widgets.map(widgetSettings =>
        React.createElement(
          WIDGETS[widgetSettings.key].component,
          {
            key: widgetSettings.key,
            widgetSettings,
          }
        )
      )
    }
  </>
}