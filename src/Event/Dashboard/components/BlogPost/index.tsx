import React from 'react'
import styled from 'styled-components'
import {blogPostTime, getDiffDatetime, now} from 'lib/date-time'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useWithAttendeeData} from 'Event/auth/data'
export type BlogPost = Publishable & {
  title: string
  postedAt: string
  publishAt: string | null
  content: string
}

export const BLOG_POST = 'Blog Post'

export function BlogPost(props: {post: BlogPost}) {
  const isEdit = useEditMode()
  const withAttendeeData = useWithAttendeeData()

  const date = props.post.publishAt || props.post.postedAt
  const formattedDate = blogPostTime(date)

  if (!isEdit && !shouldPublish(props.post)) {
    return null
  }

  return (
    <Post aria-label="blog post">
      <Title>{withAttendeeData(props.post.title)}</Title>
      <PostDate>{formattedDate}</PostDate>
      <div
        dangerouslySetInnerHTML={{
          __html: withAttendeeData(props.post.content),
        }}
      />
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

const Post = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
`

const Title = styled.h2`
  text-transform: uppercase;
  margin: 0;
  font-size: 30px;
`

const PostDate = styled.span`
  font-size: 14px;
  color: #adadad;
  display: block;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
