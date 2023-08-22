export function handleInputValue (callback) {
  return ({ target }) => callback(target.value)
}

export function handleInputEnterPress (callback) {
  return (e) => e.key === 'Enter' && callback(e)
}