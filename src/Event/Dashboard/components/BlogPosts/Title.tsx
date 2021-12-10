import {BlogPost} from 'Event/Dashboard/components/BlogPosts'
import styled from 'styled-components'
import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {useAttendeeVariables} from 'Event'

export default function Title(props: {post: BlogPost}) {
  const {post} = props
  const {postStyles: styles} = useTemplate()
  const v = useAttendeeVariables()

  return (
    <TitleText
      color={styles.titleTextColor}
      fontSize={styles.titleFontSize}
      capitalize={styles.titleCapitalize}
    >
      {v(post.title)}
    </TitleText>
  )
}

const TitleText = styled.h2<{
  color: string
  fontSize: number
  capitalize: boolean
}>`
  text-transform: ${(props) => (props.capitalize ? 'uppercase' : 'none')};
  color: ${(props) => props.color};
  margin: 0;
  font-size: ${(props) => props.fontSize}px;
`
