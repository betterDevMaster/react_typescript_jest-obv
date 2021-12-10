import React from 'react'
import PostForm from 'Event/Dashboard/components/BlogPosts/PostForm'
import {BlogPostList, BlogPostProps} from 'Event/Dashboard/components/BlogPosts'
import Buttons from 'Event/Dashboard/components/BlogPosts/Buttons'
import Title from 'Event/Dashboard/components/BlogPosts/Title'
import Content from 'Event/Dashboard/components/BlogPosts/Content'
import Date from 'Event/Dashboard/components/BlogPosts/Date'
import Container from 'Event/Dashboard/components/BlogPosts/Container'
import styled from 'styled-components'

export default function BlogPosts() {
  return <BlogPostList>{(props) => <BlogPost {...props} />}</BlogPostList>
}

function BlogPost(props: BlogPostProps) {
  const {post, postId} = props

  return (
    <Container disableSpacing={props.isLast}>
      <Title post={post} />
      <StyledDate post={post} />
      <Content post={post} />
      <PostForm post={post} />
      <Buttons post={post} postId={postId} />
    </Container>
  )
}

const StyledDate = styled(Date)`
  font-size: 14px;
  line-height: 16px;
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
