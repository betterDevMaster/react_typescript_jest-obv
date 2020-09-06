import React from 'react'
import styled from 'styled-components'

export default function WelcomeText(props: {children: string}) {
  return <Text>{props.children}</Text>
}

const Text = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
