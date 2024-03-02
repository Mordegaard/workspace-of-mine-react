import { initContextMenu } from 'scripts/content/contextMenu'
import Settings from 'scripts/methods/settings'

Settings.init().then(initContextMenu)