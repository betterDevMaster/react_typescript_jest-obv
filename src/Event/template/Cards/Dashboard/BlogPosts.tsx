import React from 'react'
import PostForm from 'Event/Dashboard/components/BlogPosts/PostForm'
import {BlogPostList, BlogPostProps} from 'Event/Dashboard/components/BlogPosts'
import Buttons from 'Event/Dashboard/components/BlogPosts/Buttons'
import Title from 'Event/Dashboard/components/BlogPosts/Title'
import Content from 'Event/Dashboard/components/BlogPosts/Content'
import Date from 'Event/Dashboard/components/BlogPosts/Date'
import Container from 'Event/Dashboard/components/BlogPosts/Container'

export default function BlogPosts() {
  return <BlogPostList>{(props) => <BlogPost {...props} />}</BlogPostList>
}

function BlogPost(props: BlogPostProps) {
  const {post, postId} = props

  return (
    <Container disableSpacing={props.isLast}>
      <Title post={post} />
      <Date post={post} />
      <Content post={post} />
      <PostForm post={post} />
      <Buttons post={post} postId={postId} />
    </Container>
  )
}
