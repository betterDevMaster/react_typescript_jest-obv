import React from 'react'
import styled from 'styled-components'
import {blogPostTime} from 'lib/date-time'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import PostForm from 'Event/template/SimpleBlog/Dashboard/BlogPosts/BlogPost/PostForm'
import {useVariables} from 'Event'
import Content from 'lib/ui/form/TextEditor/Content'
import {shouldPublish} from 'Event/Dashboard/components/BlogPost'
import {BlogPost as BlogPostData} from 'Event/Dashboard/components/BlogPost'
import {usePostStyles} from 'Event/template/SimpleBlog/Dashboard/BlogPosts/PostStylesConfig'

export const BLOG_POST = 'Blog Post'

export function BlogPost(props: {post: BlogPostData}) {
  const {post} = props
  const isEdit = useEditMode()
  const v = useVariables()
  const styles = usePostStyles()

  const date = post.publishAt || post.postedAt
  const formattedDate = blogPostTime(date)

  if (!isEdit && !shouldPublish(post)) {
    return null
  }

  return (
    <Post aria-label="blog post">
      <Title
        color={styles.titleTextColor}
        fontSize={styles.titleFontSize}
        capitalize={styles.titleCapitalize}
      >
        {v(post.title)}
      </Title>
      <Date hidden={post.hideDate}>{formattedDate}</Date>
      <StyledContent
        fontSize={styles.contentFontSize}
        color={styles.contentTextColor}
      >
        {v(post.content)}
      </StyledContent>
      <PostForm post={post} />
    </Post>
  )
}

function Date(props: {children: React.ReactNode; hidden?: boolean}) {
  const styles = usePostStyles()

  if (props.hidden) {
    return null
  }

  return <DateText color={styles.dateTextColor}>{props.children}</DateText>
}

const Post = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};

  img {
    max-width: 100%;
  }
`

const Title = styled.h2<{
  color: string
  fontSize: number
  capitalize: boolean
}>`
  text-transform: ${(props) => (props.capitalize ? 'uppercase' : 'none')};
  color: ${(props) => props.color};
  margin: 0;
  font-size: ${(props) => props.fontSize}px;
`

const DateText = styled.span<{
  color: string
}>`
  font-size: 14px;
  color: ${(props) => props.color};
  display: block;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const StyledContent = styled(Content)<{
  fontSize: number
  color: string
}>`
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.color};
`
