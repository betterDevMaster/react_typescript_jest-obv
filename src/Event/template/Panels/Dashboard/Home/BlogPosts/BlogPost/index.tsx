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
import {usePostStyles} from 'Event/template/Panels/Dashboard/Home/BlogPosts/PostStylesConfig'

export default function BlogPost(props: {post: BlogPostData; isLast: boolean}) {
  const {post, isLast} = props
  const isEdit = useEditMode()
  const v = useAttendeeVariables()
  const styles = usePostStyles()

  const date = post.publishAt || post.postedAt
  const formattedDate = localTime(date)

  const bottomMargin = isLast ? 0 : styles.spacing
  if (!isEdit && !shouldPublish(post)) {
    return null
  }

  return (
    <Post aria-label="blog post" marginBottom={bottomMargin}>
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

const Post = styled.div<{marginBottom: number}>`
  margin-bottom: ${(props) => props.marginBottom}px;
  overflow-x: hidden;

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
  line-height: 16px;
  color: ${(props) => props.color};
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

const StyledContent = styled(Content)<{
  fontSize: number
  color: string
}>`
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.color};
`
