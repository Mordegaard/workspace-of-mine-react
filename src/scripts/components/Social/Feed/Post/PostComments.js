import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { withTrigger } from 'scripts/methods/factories'
import { Modal } from 'scripts/components/ui/Modal'
import { SocialController } from 'scripts/methods/social'
import { Post } from 'scripts/components/Social/Feed/Post'
import { Comment } from 'scripts/components/Social/Feed/Post/PostComments/Comment'
import { mergeClasses } from 'scripts/methods/helpers'
import { OptionalTooltip } from 'scripts/components/ui/Tooltip'

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

  return <Modal title='Коментарі' width='800px' onClose={onClose}>
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
            post={post}
            replyTo={comments.find(({ id }) => id === comment.replyTo)}
          />
        )
      }
    </Container>
  </Modal>
}

export const PostCommentsDialog = withTrigger(PostCommentsDialogBase)

export function PostComments ({ disabled, post, ...props }) {
  const { className, ...rest } = props

  return post.comments > 0 && <PostCommentsDialog
    disabled={disabled}
    post={post}
    trigger={
      <span
        className={
          mergeClasses(disabled ? className : 'btn btn-sm btn-pill btn-basic-primary', 'me-2')
        }
        {...rest}
      >
        <OptionalTooltip condition={!disabled} content='Переглянути коментарі та відповіді то поста'>
          <span>
            <i className='bi bi-chat-dots me-1' />
            { post.comments }
          </span>
        </OptionalTooltip>
      </span>
    }
  />
}

const Container = styled('div')`
  max-width: 768px;
`