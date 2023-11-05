/**
 * @param {string} children
 * @param {Number} [limit]
 * @return {string}
 * @constructor
 */
export function SlicedText ({ children, limit = SlicedText.DEFAULT_LIMIT }) {
  return children.length > limit
    ? children.slice(0, limit).trim() + '...'
    : children
  }

SlicedText.DEFAULT_LIMIT = 96