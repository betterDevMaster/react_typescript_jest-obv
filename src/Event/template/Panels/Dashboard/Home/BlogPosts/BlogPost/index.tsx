import {useAttendeeVariables} from 'Event'
import styled from 'styled-components'
import {
  BlogPost as BlogPostData,
  shouldPublish,
} from 'Event/Dashboard/components/BlogPost'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {localTime} from 'lib/date-time'
import React from 'react'
import PostForm from 'Event/template/Panels/Dashboard/Home/BlogPosts/BlogPost/PostForm'
import Content from 'lib/ui/form/TextEditor/Content'

export default function BlogPost(props: {post: BlogPostData}) {
  const {post} = props
  const isEdit = useEditMode()
  const v = useAttendeeVariables()

  const date = post.publishAt || post.postedAt
  const formattedDate = localTime(date)

  if (!isEdit && !shouldPublish(post)) {
    return null
  }

  return (
    <Post aria-label="blog post">
      <Title>{v(post.title)}</Title>
      <Date hidden={post.hideDate}>{formattedDate}</Date>
      <StyledContent>{v(post.content)}</StyledContent>
      <PostForm post={post} />
    </Post>
  )
}

function Date(props: {children: React.ReactNode; hidden?: boolean}) {
  if (props.hidden) {
    return null
  }

  return <DateText>{props.children}</DateText>
}

const Post = styled.div`
  margin-bottom: 30px;
  overflow-x: hidden;

  img {
    max-width: 100%;
  }
`

const Title = styled.h2`
  text-transform: uppercase;
  margin-bottom: 14px;
  font-size: 28px;
  line-height: 22px;
`

const DateText = styled.span`
  font-size: 14px;
  line-height: 16px;
  color: #adadad;
  display: block;
  position: relative;
  margin: 0 0 16px;
  background: transparent;

  /* Separator line after date */
  &:after {
    content: ' ';
    background: #adadad;
    position: absolute;
    width: 100%;
    height: 1px;
    top: 50%;
    margin-left: 20px;
  }
`

const StyledContent = styled(Content)``
