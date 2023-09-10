import React, { useEffect, useState } from 'react'

import { Settings } from 'scripts/methods/storage'

export function Wallpaper () {
  const [ settings, setSettings ] = useState({})

  const fetchSettings = async () => {
    setSettings(await Settings.get())
  }

  const updateSettings = async (key, value) => {
    await Settings.set(key, value)
    await fetchSettings()
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return <div>
    <div className='row g-0'>
      <div className='col'>
        Використовувати випадкові шпалери з субреддіта <b>r/wallpaper</b>
      </div>
      <div className='col-auto'>
        <div className='form-check form-switch'>
          <input
            checked={settings.fetch_wallpaper ?? false}
            className='form-check-input'
            type='checkbox'
            role='switch'
            onChange={({ target }) => updateSettings('fetch_wallpaper', target.checked)}
          />
        </div>
      </div>
    </div>
  </div>
}