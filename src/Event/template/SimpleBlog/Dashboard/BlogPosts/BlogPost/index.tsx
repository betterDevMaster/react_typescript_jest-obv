import React from 'react'
import styled from 'styled-components'
import {blogPostTime} from 'lib/date-time'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import PostForm from 'Event/template/SimpleBlog/Dashboard/BlogPosts/BlogPost/PostForm'
import {useVariables} from 'Event'
import {useEvent} from 'Event/EventProvider'
import Content from 'lib/ui/form/TextEditor/Content'
import {shouldPublish} from 'Event/Dashboard/components/BlogPost'
import {BlogPost as BlogPostData} from 'Event/Dashboard/components/BlogPost'

export const BLOG_POST = 'Blog Post'

export function BlogPost(props: {post: BlogPostData}) {
  const {post} = props
  const isEdit = useEditMode()
  const v = useVariables()
  const {event} = useEvent()

  const date = post.publishAt || post.postedAt
  const formattedDate = blogPostTime(date)

  const isBmc = event.slug === 'bmc'
  const fontSize = isBmc ? '22px' : 'inherit'

  if (!isEdit && !shouldPublish(post)) {
    return null
  }

  return (
    <Post aria-label="blog post">
      <Title>{v(post.title)}</Title>
      <Date hidden={post.hideDate}>{formattedDate}</Date>
      <StyledContent fontSize={fontSize}>{v(post.content)}</StyledContent>
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
  margin-bottom: ${(props) => props.theme.spacing[8]};

  img {
    max-width: 100%;
  }
`

const Title = styled.h2`
  text-transform: uppercase;
  margin: 0;
  font-size: 30px;
`

const DateText = styled.span`
  font-size: 14px;
  color: #adadad;
  display: block;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const StyledContent = styled(Content)<{
  fontSize: string
}>`
  font-size: ${(props) => props.fontSize};
`
