import React from 'react'
import styled from 'styled-components'

export default function Clickable(props: {
  onClick: () => void
  children: React.ReactElement
  className?: string
}) {
  return (
    <Box onClick={props.onClick} className={props.className}>
      {props.children}
    </Box>
  )
}

const Box = styled.div`
  cursor: pointer;
  position: relative;
  width: 100%;

  &:hover {
    opacity: 0.6;
  }
`
