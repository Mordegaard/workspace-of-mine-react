import React from 'react'

export function SettingsContainer ({ settings, updateSettings, components = [] }) {
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