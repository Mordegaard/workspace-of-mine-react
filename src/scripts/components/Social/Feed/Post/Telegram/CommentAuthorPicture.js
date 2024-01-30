import React from 'react'

import { ProfilePicture } from 'scripts/components/ui/Telegram/ProfilePicture'

/**
 * @param {PostComment} comment
 * @return {JSX.Element}
 * @constructor
 */
export function CommentAuthorPicture ({ comment }) {
  const id = comment.originalPost.author?.id ?? comment.originalPost.peerId?.channelId

  return <ProfilePicture
    userId={id}
    alt={comment.author}
  />
}