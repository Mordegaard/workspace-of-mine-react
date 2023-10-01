import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { withTrigger } from 'scripts/methods/withComponent'
import { Modal } from 'scripts/components/ui/Modal'
import { SocialController } from 'scripts/methods/social'
import { Post } from 'scripts/components/Social/Feed/Post'
import { Comment } from 'scripts/components/Social/Feed/Post/PostComments/Comment'
import { mergeClasses } from 'scripts/methods/helpers'

/**
 * @param {FormattedPost} post
 * @param {function} onClose
 * @return {JSX.Element}
 * @constructor
 */
function PostCommentsDialogBase ({ post, onClose }) {
  const [ comments, setComments ] = useState([])

  async function fetchComments () {
    const comments = await SocialController.posts.getCommentsByPost(post)
    setComments(comments)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return <Modal title='Коментарі' onClose={onClose}>
    <Post post={post} interactive={false} />
    <Container className='px-3'>
      {
        comments.length === 0 && <div className='w-100 text-center text-gray-500 my-3'>Немає коментарів</div>
      }
      {
        comments.map((comment, index) =>
          <Comment
            key={index}
            comment={comment}
            replyTo={comments.find(({ id }) => id === comment.replyTo)}
          />
        )
      }
    </Container>
  </Modal>
}

export const PostCommentsDialog = withTrigger(PostCommentsDialogBase)

export function PostComments ({ disabled, post }) {
  return <PostCommentsDialog
    disabled={disabled}
    post={post}
    trigger={
      <span
        className={
          mergeClasses(disabled ? 'text-gray-500 me-2' : 'btn btn-sm btn-pill btn-basic-primary me-1', 'fs-7')
        }
      >
          <i className='bi bi-chat-dots me-1' />
        { post.comments }
        </span>
    }
  />
}

const Container = styled('div')`
  max-width: 768px;
`