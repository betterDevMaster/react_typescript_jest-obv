import React from 'react'
import styled from 'styled-components'

export default function Heading(props: {children: string}) {
  return <Text>{props.children}</Text>
}

const Text = styled.h2`
  margin: 0 0 ${(props) => props.theme.spacing[2]};
  font-size: 30px;
  font-weight: bold;
  font-style: italic;
`
