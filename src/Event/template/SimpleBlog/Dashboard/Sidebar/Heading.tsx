import {useSimpleBlog} from 'Event/template/SimpleBlog'
import React from 'react'
import styled from 'styled-components'

export default function Heading(props: {
  children: string
  'aria-label'?: string
}) {
  const {template} = useSimpleBlog()
  const {sidebar} = template
  return (
    <Text aria-label={props['aria-label']} color={sidebar.textColor}>
      {props.children}
    </Text>
  )
}

const Text = styled.h2<{color: string}>`
  margin: 0 0 ${(props) => props.theme.spacing[2]};
  font-size: 30px;
  font-weight: bold;
  font-style: italic;
  color: ${(props) => props.color};

  &:empty {
    width: ${(props) => props.theme.spacing[14]};
    height: ${(props) => props.theme.spacing[8]};
  }
`
