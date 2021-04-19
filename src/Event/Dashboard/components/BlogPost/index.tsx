import React from 'react'
import styled from 'styled-components'
import {blogPostTime, getDiffDatetime, now} from 'lib/date-time'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useWithAttendeeData} from 'Event/auth/data'
import PostForm from 'Event/Dashboard/components/BlogPost/PostForm'
import {InfusionsoftTag} from 'Event/infusionsoft'

export type BlogPost = Publishable & {
  title: string
  postedAt: string
  publishAt: string | null
  content: string
  formId?: number | null
  canResubmitForm?: boolean
  onSubmitRedirectUrl?: string
  formSubmittedText?: string
  isModalForm?: boolean
  modalButtonText?: string
  formActionId?: string | null
  infusionsoftTag?: InfusionsoftTag | null
}

export const BLOG_POST = 'Blog Post'

export function BlogPost(props: {post: BlogPost}) {
  const {post} = props
  const isEdit = useEditMode()
  const withAttendeeData = useWithAttendeeData()

  const date = post.publishAt || post.postedAt
  const formattedDate = blogPostTime(date)

  if (!isEdit && !shouldPublish(post)) {
    return null
  }

  return (
    <Post aria-label="blog post">
      <Title>{withAttendeeData(post.title)}</Title>
      <PostDate>{formattedDate}</PostDate>
      <div
        dangerouslySetInnerHTML={{
          __html: withAttendeeData(post.content),
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
