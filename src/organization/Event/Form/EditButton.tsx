import EditIconButton from 'lib/ui/IconButton/EditIconButton'
import React from 'react'
import styled from 'styled-components'

export default function EditButton(props: {
  onClick: () => void
  children: React.ReactElement
}) {
  return (
    <Box>
      <StyledEditIconButton
        onClick={props.onClick}
        aria-label="edit question"
      />
      {props.children}
    </Box>
  )
}

const StyledEditIconButton = styled(EditIconButton)`
  position: absolute;
  z-index: 2;
  right: ${(props) => props.theme.spacing[1]};
  top: ${(props) => props.theme.spacing[1]};
  display: none;

  &:hover {
    opacity: 0.8;
  }
`

const Box = styled.div`
  position: relative;

  &:hover ${StyledEditIconButton} {
    display: inline-flex;
  }
`
