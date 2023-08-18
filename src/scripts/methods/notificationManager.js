import { generateToken } from 'scripts/methods/helpers'

/**
 * @typedef {Object} AppNotification
 * @property {string} id
 * @property {string} message
 * @property {('info'|'success'|'error')} type
 * @property {number} delay
 */

export default class NotificationManager {
  static notifications = []
  static container     = document.getElementById('notification_portal')

  static EVENT_NAME = 'mbr.notify'

  static DEFAULT_DELAY = 3000

  static TYPE_INFO    = 'info'
  static TYPE_SUCCESS = 'success'
  static TYPE_ERROR   = 'error'

  static notify (
    message,
    type = NotificationManager.TYPE_INFO,
    delay = NotificationManager.DEFAULT_DELAY
  ) {
    const event = new CustomEvent(
      NotificationManager.EVENT_NAME,
      { detail: { message, type, delay, id: generateToken() } }
    )

    this.container.dispatchEvent(event)
  }

  static _addNotification (notification, callback) {
    this.notifications.push(notification)
    typeof callback === 'function' && callback([ ...this.notifications ])
  }

  static _removeNotification (notification, callback) {
    this.notifications = this.notifications.filter(({ id }) => id !== notification.id)
    typeof callback === 'function' && callback([ ...this.notifications ])
  }
}