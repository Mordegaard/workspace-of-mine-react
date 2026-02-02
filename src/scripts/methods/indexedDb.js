import Dexie from 'dexie'

export async function requestPersistentStorage () {
  if (navigator.storage && navigator.storage.persist) {
    return await navigator.storage.persist()
  }

  return false
}

export const imagesDb = new Dexie('Images')

imagesDb.version(1).stores({
  images: '++id, name'
})

/**
 * @param {String} name
 * @param {Blob} blob
 * @return {Promise<*>}
 */
imagesDb.putImage = async (name, blob) => {
  const count = await imagesDb.images
    .where('name')
    .equals(name)
    .modify({ data: blob })

  if (count > 0) {
    return true
  }

  const imageObject = {
    name,
    data: blob
  }

  return !!(await imagesDb.images.add(imageObject))
}

/**
 *
 * @param {String} name
 * @return {Promise<Blob>}
 */
imagesDb.getImage = async (name) => {
  const imageRecord = await imagesDb.images.get({ name })
  return imageRecord ? imageRecord.data : null
}