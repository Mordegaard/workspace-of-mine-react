/* global telegram */

import { CustomEmoji } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/CustomEmoji'
import React from 'react'

export default class TelegramHelpers {
  constructor (manager) {
    this.manager = manager
  }

  /**
   * @param {Array} array
   * @return {Buffer}
   */
  arrayToBuffer (array) {
    if (!Array.isArray(array)) {
      throw new Error(`Array is expected but ${typeof array} provided`)
    }

    const writer = new telegram.extensions.BinaryWriter(new Buffer([]))
    writer.write(Buffer.from(array))

    return writer.getValue()
  }

  /**
   * @param {string} message
   * @param {Array|null} [entities]
   * @param {Object} [state]
   */
  formatMessage (message, entities = null, state = null) {
    if (!Array.isArray(entities)) return message

    const extendedEntities = [ null, ...entities.map(entity => ([ entity, null ])) ].flat()
    const result = []

    extendedEntities.forEach((entity, index) => {
      if (entity != null) {
        const { offset, length } = entity

        let part = message.slice(offset, offset + length)

        if (typeof ENTITY_TRANSFORMERS[entity.className] === 'function') {
          part = ENTITY_TRANSFORMERS[entity.className](part, entity, state)
        }

        result.push(part)
      } else {
        const start = extendedEntities[index - 1]
          ? extendedEntities[index - 1].offset + extendedEntities[index - 1].length
          : 0

        const end = extendedEntities[index + 1]
          ? extendedEntities[index + 1].offset
          : message.length

        result.push(message.slice(start, end))
      }
    })

    return result.filter(Boolean)
  }
}

const ENTITY_TRANSFORMERS = {
  'MessageEntityCustomEmoji': (part, entity, state) => {
    const foundDocument = state?.emojiDocuments?.find(document => String(document.id) === String(entity.documentId))

    if (foundDocument != null) {
      return <CustomEmoji
        key={String(foundDocument.id) + entity.offset + entity.length}
        document={foundDocument}
        originalEmoji={part}
      />
    }

    return part
  },
  'MessageEntityUrl': (part) => {
    return <a href={part} target='_blank' rel='noreferrer'>{ part }</a>
  },
  'MessageEntityTextUrl': (part, entity) => {
    return <a href={entity.url} target='_blank' rel='noreferrer'>{ part }</a>
  },
  'MessageEntityBold': (part) => {
    return <b>{ part }</b>
  }
}