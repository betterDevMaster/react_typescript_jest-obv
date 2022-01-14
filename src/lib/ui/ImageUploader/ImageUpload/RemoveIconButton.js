import React from 'react'
import Icon from 'lib/ui/Icon'
import styled from 'styled-components'

export default function RemoveIconButton(props) {
  if (!props.isVisible) {
    return null
  }

  return (
    <CloseIcon
      className="far fa-times-circle"
      onClick={props.onClick}
      disabled={props.disabled}
    />
  )
}

const CloseIcon = styled(Icon)`
  cursor: pointer;
  display: inline-block;
  margin-left: -${(props) => props.theme.spacing[15]};
  margin-top: ${(props) => props.theme.spacing[3]};
  position: absolute;
  &: hover {
    cursor: point;
  }
`
