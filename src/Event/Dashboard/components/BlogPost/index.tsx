import React from 'react'
import styled from 'styled-components'
import {blogPostTime, getDiffDatetime, now} from 'lib/date-time'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import PostForm from 'Event/Dashboard/components/BlogPost/PostForm'
import {HasRules} from 'Event/visibility-rules'
import {useVariables} from 'Event'
import {useEvent} from 'Event/EventProvider'

export type BlogPost = Publishable &
  HasRules & {
    title: string
    postedAt: string
    publishAt: string | null
    content: string
    formId?: number | null
    isModalForm?: boolean
    modalButtonText?: string
    hideDate?: boolean
  }

export const BLOG_POST = 'Blog Post'

export function BlogPost(props: {post: BlogPost}) {
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
      <Content
        fontSize={fontSize}
        dangerouslySetInnerHTML={{
          __html: v(post.content),
        }}
      />
      <PostForm post={post} />
    </Post>
  )
}

function shouldPublish(post: BlogPost) {
  if (!post.publishAt) {
    return true
  }

  // is past publish date
  return getDiffDatetime(post.publishAt, now()) < 0
}

function Date(props: {children: React.ReactNode; hidden?: boolean}) {
  if (props.hidden) {
    return null
  }

  return <DateText>{props.children}</DateText>
}

const Post = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
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

const Content = styled.div<{
  fontSize: string
}>`
  font-size: ${(props) => props.fontSize};
`
