class EventsInstance {
  constructor (container) {
    this.container = container ?? document.body
  }

  trigger (eventName, data = null) {
    const event = new CustomEvent(
      eventName,
      { detail: data }
    )

    this.container.dispatchEvent(event)
  }

  on (eventName, callback) {
    this.container.addEventListener(eventName, callback)
  }

  off (eventName, callback) {
    this.container.removeEventListener(eventName, callback)
  }
}

const Events = new EventsInstance()

export default Events

export function dispatchContextMenu (element, optionalMouseEvent = null) {
  const event = new MouseEvent('contextmenu', optionalMouseEvent ?? {})
  element.dispatchEvent(event)
}