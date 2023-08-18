import { createPortal } from 'react-dom'

export function PopperPortal ({ children }) {
  return createPortal(children, document.getElementById('popper_portal'))
}