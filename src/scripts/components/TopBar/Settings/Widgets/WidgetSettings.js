import React from 'react'

import { WidgetParam } from 'scripts/components/TopBar/Settings/Widgets/WidgetParam'

export function WidgetSettings ({ widgetKey, definition, settings, updateSettings }) {
  const widgets = settings.widgets ?? []
  const currentWidgetSettings = widgets.find(({ key }) => key === widgetKey)

  const toggleWidget = () => {
    if (currentWidgetSettings) {
      updateSettings('widgets', widgets.filter(({ key }) => key !== widgetKey))
    } else {
      const defaultWidgetSettings = {
        key: widgetKey,
        params: Object.fromEntries(
          Object.entries(definition.params).map(([ key, { defaultValue } ]) => [ key, defaultValue ])
        )
      }

      updateSettings('widgets', [ ...widgets, defaultWidgetSettings ])
    }
  }

  const updateWidgetParams = (newParams = {}) => {
    const newWidgets = [ ...widgets ]

    newWidgets[newWidgets.indexOf(currentWidgetSettings)].params = {
      ...currentWidgetSettings.params,
      ...newParams
    }

    updateSettings('widgets', newWidgets)
  }

  return <div className='mb-5'>
    <div className='row g-0 align-items-center'>
      <h3 className='col m-0'>
        { definition.name }
      </h3>
      <div className='col-auto'>
        <div className='form-check form-switch'>
          <input
            checked={!!currentWidgetSettings}
            className='form-check-input'
            type='checkbox'
            role='switch'
            onChange={toggleWidget}
          />
        </div>
      </div>
    </div>
    {
      !!currentWidgetSettings && <div className='ms-3 ps-3 border-start border-primary border-2'>
        {
          Object.entries(definition.params).map(([ key, param ]) =>
            <div key={key} className='row g-0 align-items-center my-2'>
              <div className='col'>
                { param.name }
              </div>
              <div className='col-auto'>
                <WidgetParam
                  value={currentWidgetSettings.params[key] ?? param.defaultValue}
                  param={param}
                  onChange={value => updateWidgetParams({ [key]: value })}
                />
              </div>
            </div>
          )
        }
      </div>
    }
  </div>
}