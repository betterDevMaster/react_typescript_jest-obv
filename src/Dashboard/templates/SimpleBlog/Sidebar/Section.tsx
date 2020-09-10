import React from 'react'
import styled from 'styled-components'

export default function Section(props: {children: React.ReactElement}) {
  return <Box>{props.children}</Box>
}

const Box = styled.div`
  border-top: 1px solid #ffffff;
  padding: ${(props) => props.theme.spacing[8]} 0;
`
