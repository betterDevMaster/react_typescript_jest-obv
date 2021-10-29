import React from 'react'
import styled from 'styled-components'

export default function Divider() {
  return <Line />
}

const Line = styled.div`
  display: block;
  height: 1px;
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  margin-bottom: ${(props) => props.theme.spacing[15]};
`
