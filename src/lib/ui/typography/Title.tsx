import React from 'react'
import styled from 'styled-components'

export default function Title(props: {children: string}) {
  return <Text>{props.children}</Text>
}

const Text = styled.h3`
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  margin: 0;
  margin-bottom: ${(props) => props.theme.spacing[16]};
`
