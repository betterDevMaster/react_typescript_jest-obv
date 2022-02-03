import React from 'react'
import styled from 'styled-components'

type HeadingPorps = {
  fontWeight?: number | string
  fontSize?: number
  lineHeight?: number
  color?: string
  children: React.ReactNode | string
}

export default function Heading3(props: HeadingPorps) {
  return <Text {...props}>{props.children}</Text>
}

const Text = styled.h3<HeadingPorps>`
  font-weight: ${(props) => props.fontWeight || 'unset'};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : 'unset')};
  line-height: ${(props) =>
    props.lineHeight ? `${props.lineHeight}px` : 'unset'};
  color: ${(props) => props.color || 'unset'};
  margin: unset;
`
