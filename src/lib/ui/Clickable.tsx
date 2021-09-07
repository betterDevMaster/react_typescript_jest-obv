import React from 'react'
import styled from 'styled-components'

export default function Clickable(props: {
  onClick: () => void
  children: React.ReactElement
  className?: string
  disabled?: boolean
  'aria-label'?: string
}) {
  const handleClick = () => {
    if (props.disabled) {
      return
    }

    props.onClick()
  }

  return (
    <Box
      onClick={handleClick}
      className={props.className}
      disabled={props.disabled}
      aria-label={props['aria-label']}
    >
      {props.children}
    </Box>
  )
}

const Box = styled.div<{disabled?: boolean}>`
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  width: 100%;

  &:hover {
    opacity: 0.6;
  }
`
