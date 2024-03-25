/* global telegram */

import { CustomEmoji } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/CustomEmoji'
import React from 'react'
import { TELEGRAM_BASE } from 'scripts/methods/social/constants'

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

    const groupedEntities = entities.reduce(
      (acc, entity) => {
        const key = `${entity.offset}.${entity.length}`
        acc[key] = [ ...(acc[key] ?? []), entity ]
        return acc
      },
      {}
    )

    const extendedEntities = [ null, ...Object.values(groupedEntities).flatMap(entity => ([ entity, null ])) ]
    const result = []

    extendedEntities.forEach((entityArray, index) => {
      if (entityArray != null) {
        const { offset, length } = entityArray[0]

        let part = message.slice(offset, offset + length)

        entityArray.forEach(entity => {
          if (typeof ENTITY_TRANSFORMERS[entity.className] === 'function') {
            part = ENTITY_TRANSFORMERS[entity.className](part, entity, state)
          }
        })

        result.push(part)
      } else {
        const start = extendedEntities[index - 1]
          ? extendedEntities[index - 1][0].offset + extendedEntities[index - 1][0].length
          : 0

        const end = extendedEntities[index + 1]
          ? extendedEntities[index + 1][0].offset
          : message.length

        result.push(message.slice(start, end))
      }
    })

    return result.filter(Boolean)
  }
}

const entityKey = entity => entity.className + String(entity.offset) + String(entity.length)

const ENTITY_TRANSFORMERS = {
  'MessageEntityCustomEmoji': (part, entity, state) => {
    const foundDocument = state?.emojiDocuments?.find(document => String(document.id) === String(entity.documentId))

    if (foundDocument != null) {
      return <CustomEmoji
        key={entityKey(entity)}
        document={foundDocument}
        originalEmoji={part}
      />
    }

    return part
  },
  'MessageEntityUrl': (part, entity) => {
    return <a key={entityKey(entity)} href={part} target='_blank' rel='noreferrer'>{ part }</a>
  },
  'MessageEntityTextUrl': (part, entity) => {
    return <a key={entityKey(entity)} href={entity.url} target='_blank' rel='noreferrer'>{ part }</a>
  },
  'MessageEntityBold': (part, entity) => {
    return <b key={entityKey(entity)}>{ part }</b>
  },
  'MessageEntityItalic': (part, entity) => {
    return <i key={entityKey(entity)}>{ part }</i>
  },
  'MessageEntityMention': (part, entity) => {
    return <a key={entityKey(entity)} href={TELEGRAM_BASE + part.replace('@', '')} target='_blank' rel='noreferrer'>{ part }</a>
  }
}