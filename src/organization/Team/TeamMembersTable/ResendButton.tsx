import React from 'react'
import styled from 'styled-components'
import ReplayIcon from '@material-ui/icons/Replay'
import IconButton from 'lib/ui/IconButton'

export default function ResendButton(props: {
  onClick?: () => void
  className?: string
  color?: string
  'aria-label'?: string
  disabled?: boolean
}) {
  return (
    <IconButton
      className={props.className}
      onClick={props.onClick}
      aria-label={props['aria-label']}
      disabled={props.disabled}
    >
      <StyledIcon />
    </IconButton>
  )
}

const StyledIcon = styled(ReplayIcon)`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.25rem;
`
