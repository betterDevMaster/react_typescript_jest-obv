import {BlogPost} from 'Event/Dashboard/components/BlogPosts'
import styled from 'styled-components'
import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {localTime} from 'lib/date-time'

export default function Date(props: {post: BlogPost; className?: string}) {
  const {post} = props
  const {postStyles} = useTemplate()

  const date = post.publishAt || post.postedAt
  const formattedDate = localTime(date)

  if (post.hideDate) {
    return null
  }

  return (
    <Text color={postStyles.dateTextColor} className={props.className}>
      {formattedDate}
    </Text>
  )
}

const Text = styled.span<{
  color: string
}>`
  font-size: 14px;
  color: ${(props) => props.color};
  display: block;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
