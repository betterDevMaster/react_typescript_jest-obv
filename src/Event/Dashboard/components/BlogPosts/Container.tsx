import styled from 'styled-components'
import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'

export default function Container(props: {
  children: JSX.Element | JSX.Element[]
  disableSpacing: boolean
}) {
  const {disableSpacing} = props
  const {postStyles} = useTemplate()

  const marginBottom = disableSpacing ? 0 : postStyles.spacing

  return (
    <Post aria-label="blog post" marginBottom={marginBottom}>
      {props.children}
    </Post>
  )
}

const Post = styled.div<{marginBottom: number}>`
  margin-bottom: ${(props) => props.marginBottom}px;

  img {
    max-width: 100%;
  }
`
