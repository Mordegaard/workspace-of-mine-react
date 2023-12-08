import React, { useEffect, useReducer, useState } from 'react'

import { TelegramManager } from 'scripts/methods/telegram'
import { CustomEmoji } from 'scripts/components/Social/Feed/Post/Telegram/PostMediaItem/CustomEmoji'

const reducer = (state, data) => {
  return { ...state, ...data }
}

/**
 * @param {FormattedPost} post
 * @return {JSX.Element}
 * @constructor
 */
export function PostContent ({ post }) {
  const [ body, setBody ] = useState(post.title?.split() ?? [])
  const [ state, updateState ] = useReducer(reducer, {
    emojiDocuments: []
  })

  const entities  = post.originalPost.entities ?? []

  const fetchEmojiDocuments = async () => {
    const documentIds = entities
      .filter(entity => entity.className === 'MessageEntityCustomEmoji')
      .map(entity => entity.documentId)

    updateState({ emojiDocuments: await TelegramManager.getCustomEmojis(documentIds) })
  }

  const formatBody = () => {
    let newBody = [ ...body ]

    entities.forEach(entity => {
      if (typeof ENTITY_TRANSFORMERS[entity.className] === 'function') {
        newBody = ENTITY_TRANSFORMERS[entity.className](newBody, entity, state)
      }
    })

    setBody(joinBody(newBody))
  }

  useEffect(() => {
    fetchEmojiDocuments()
  }, [])

  useEffect(() => {
    formatBody()
  }, [ state ])

  return <div>
    { body }
  </div>
}

function joinBody (bodyArray) {
  const parts = []

  let accumulator = null

  bodyArray.forEach(item => {
    if (typeof item === 'string') {
      accumulator = (accumulator ?? '') + item
    } else {
      if (accumulator != null) {
        parts.push(accumulator)
        accumulator = null
      }

      parts.push(item)
    }
  })

  if (accumulator != null) {
    parts.push(accumulator)
  }

  return parts
}

const ENTITY_TRANSFORMERS = {
  'MessageEntityCustomEmoji': (bodyArray, entity, state) => {
    const foundDocument = state.emojiDocuments.find(document => String(document.id) === String(entity.documentId))

    if (foundDocument != null) {
      const [ originalEmoji ] = bodyArray.splice(entity.offset, 1)
      const customEmoji       = <CustomEmoji
        key={String(foundDocument.id)}
        document={foundDocument}
        originalEmoji={originalEmoji}
      />

      bodyArray.splice(entity.offset, 0, customEmoji)
    }

    return bodyArray
  }
}