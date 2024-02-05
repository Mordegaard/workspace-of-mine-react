import React, { useEffect, useReducer, useState } from 'react'

import { TelegramManager } from 'scripts/methods/telegram'

const reducer = (state, data) => {
  return { ...state, ...data }
}

/**
 * @param {FormattedPost} post
 * @return {JSX.Element}
 * @constructor
 */
export function PostContent ({ post }) {
  const [ body, setBody ] = useState(post.text)
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
    setBody(TelegramManager.helpers.formatMessage(post.text, entities, state))
  }

  useEffect(() => {
    fetchEmojiDocuments()
  }, [])

  useEffect(() => {
    formatBody()
  }, [ state ])

  return body != null && <div className='ws-pre-wrap'>
    { body }
  </div>
}