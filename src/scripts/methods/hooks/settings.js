import { useState } from 'react'

import SettingsManager from 'scripts/methods/settings'
import { useCustomEvent } from 'scripts/methods/hooks/generalHooks'

const getSettings = () => structuredClone(SettingsManager.get())

export function useSettings () {
  const [ settings, setSettings ] = useState(getSettings())

  useCustomEvent('settings:update', () => setSettings(getSettings()))

  return settings
}