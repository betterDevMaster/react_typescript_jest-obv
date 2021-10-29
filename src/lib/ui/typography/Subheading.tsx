import React from 'react'
import styled from 'styled-components'

export default function Subheading(props: {children: string}) {
  return <Text>{props.children}</Text>
}

const Text = styled.h5`
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  margin: 0 0 ${(props) => props.theme.spacing[5]};
`
