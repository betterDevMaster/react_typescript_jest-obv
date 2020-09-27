import NavButton, {
  NavButton as NavButtonData,
} from 'Dashboard/components/NavButton'
import styled from 'styled-components'
import React from 'react'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'
import {newTabProps} from 'lib/link'

export default function NavButtonWithEdit(
  props: NavButtonData & {tabProps: typeof newTabProps | null},
) {
  const {tabProps, ...buttonProps} = props
  return (
    <Box>
      <StyledEditIconButton />
      <NavButton {...buttonProps} isEditMode={false} />
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
