import {BlogPost} from 'Event/Dashboard/components/BlogPosts'
import styled from 'styled-components'
import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {useAttendeeVariables} from 'Event'
import TextContent from 'lib/ui/form/TextEditor/Content'

export default function Content(props: {post: BlogPost}) {
  const {post} = props
  const {postStyles: styles} = useTemplate()
  const v = useAttendeeVariables()

  return (
    <StyledContent
      fontSize={styles.contentFontSize}
      color={styles.contentTextColor}
    >
      {v(post.content)}
    </StyledContent>
  )
}

const StyledContent = styled(TextContent)<{
  fontSize: number
  color: string
}>`
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.color};
`
