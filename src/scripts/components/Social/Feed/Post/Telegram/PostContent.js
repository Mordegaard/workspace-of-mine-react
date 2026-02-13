import React, { useCallback, useEffect, useReducer, useState } from 'react'

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
  const [ fwdFrom, setFwdFrom ] = useState(null)
  const [ state, updateState ] = useReducer(reducer, {
    emojiDocuments: []
  })

  const entities  = post.originalPost.entities ?? []

  const fetchFwdFrom = useCallback(async () => {
    if (!post.originalPost.fwdFrom) return

    let name = post.originalPost.fwdFrom.fromName

    if (name == null && post.originalPost.fwdFrom.fromId?.channelId) {
      const channelId = post.originalPost.fwdFrom.fromId.channelId

      const { chats } = await TelegramManager.getChannel(channelId)

      name = chats[0].title
    }

    setFwdFrom(name)
  }, [])

  const fetchEmojiDocuments = useCallback(async () => {
    const documentIds = entities
      .filter(entity => entity.className === 'MessageEntityCustomEmoji')
      .map(entity => entity.documentId)

    updateState({ emojiDocuments: await TelegramManager.getCustomEmojis(documentIds) })
  }, [])

  const formatBody = () => {
    setBody(TelegramManager.helpers.formatMessage(post.text, entities, state))
  }

  useEffect(() => {
    fetchEmojiDocuments()
    fetchFwdFrom()
  }, [])

  useEffect(() => {
    formatBody()
  }, [ state ])

  return body != null && <div className='px-3 py-2ws-pre-wrap'>
    <div>
      { body }
    </div>
    {
      fwdFrom != null && <div className='text-primary my-2'>
        <i className='bi bi-forward me-1' />
        Переслано від <b>{ fwdFrom }</b>
      </div>
    }
  </div>
}