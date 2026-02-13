import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { withTrigger } from 'scripts/methods/factories'
import { Modal } from 'scripts/components/ui/Modal'
import { SocialController } from 'scripts/methods/social'
import { Post } from 'scripts/components/Social/Feed/Post'
import { Comment } from 'scripts/components/Social/Feed/Post/PostComments/Comment'
import { mergeClasses } from 'scripts/methods/helpers'
import { OptionalTooltip } from 'scripts/components/ui/Tooltip'
import { ProfilePicture } from 'scripts/components/ui/Telegram/ProfilePicture'

 /**
 * @param {Array} comments flat array list
 * @return {Array} nested array list
 */
function buildCommentTree(comments) {
  const commentMap = comments.reduce((map, comment) => {
    map[comment.id] = {
      ...comment,
      children: []
    }
    return map
  }, {})

  const rootComments = []

  comments.forEach(comment => {
    const commentWithChildren = commentMap[comment.id]
    
    if (comment.replyTo && commentMap[comment.replyTo]) {
      commentMap[comment.replyTo].children.push(commentWithChildren)
    } else {
      rootComments.push(commentWithChildren)
    }
  })

  return rootComments
}

function CommentWithReplies({ comment, post, level = 0 }) {
  const hasChildren = comment.children && comment.children.length > 0

  return <CommentWrapper className={mergeClasses(level > 0 && 'nested-comment')}>
    <Comment
      comment={comment}
      post={post}
    >
      { hasChildren && <NestingIndicator /> }
    </Comment>
    {
      hasChildren && <RepliesContainer>
        {
          comment.children.map((childComment, index) =>
            <CommentWithReplies
              key={index}
              comment={childComment}
              post={post}
              level={level + 1}
            />
          )
        }
      </RepliesContainer>
    }
  </CommentWrapper>
}

/**
 * @param {FormattedPost} post
 * @param {function} onClose
 * @return {JSX.Element}
 * @constructor
 */
function PostCommentsDialogBase ({ post, onClose }) {
  const [ comments, setComments ] = useState([])
  const [ commentTree, setCommentTree ] = useState([])

  async function fetchComments () {
    const fetchedComments = await SocialController.posts.getCommentsByPost(post)
    setComments(fetchedComments)
    setCommentTree(buildCommentTree(fetchedComments))
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
        commentTree.map((comment, index) => (
          <CommentWithReplies
            key={index}
            comment={comment}
            post={post}
          />
        ))
      }
    </Container>
  </Modal>
}

export const PostCommentsDialog = withTrigger(PostCommentsDialogBase)

export function PostComments ({ disabled, post, ...props }) {
  return post.comments > 0 && <PostCommentsDialog
    disabled={disabled}
    post={post}
    trigger={
      <span
        {...props}
        className={mergeClasses(disabled ? mergeClasses('px-2', props.className) : 'btn btn-sm btn-pill btn-basic-primary lh-0', 'me-1')}
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

const CommentWrapper = styled('div')`
  margin-bottom: 8px;
  
  &.nested-comment {
    margin-top: 8px;
    margin-bottom: 0;
  }
`

const NestingIndicator = styled('div')`
  position: absolute;
  top: ${ProfilePicture.SIZE}px;
  left: ${ProfilePicture.SIZE / 2}px;
  height: calc(100% - 8px);
  width: 24px;
  border-radius: 0 0 0 16px;
  border-left: 1px solid var(--bs-gray-300);
  border-bottom: 1px solid var(--bs-gray-300);
  z-index: 0;
`

const RepliesContainer = styled('div')`
  margin-left: 50px;
`