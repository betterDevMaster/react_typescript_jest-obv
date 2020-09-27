import React from 'react'
import styled from 'styled-components'
import {blogPostTime} from 'system/date-time'

export interface BlogPost {
  title: string
  postedAt: string
  content: string
}

export function BlogPost(props: BlogPost) {
  const formattedPost = blogPostTime(props.postedAt, 'America/New_York')

  return (
    <Post aria-label="blog post">
      <Title>{props.title}</Title>
      <PostDate>{formattedPost}</PostDate>
      <div
        dangerouslySetInnerHTML={{
          __html: props.content,
        }}
      />
    </Post>
  )
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
