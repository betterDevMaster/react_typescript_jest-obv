import React from 'react'
import Icon from 'lib/ui/Icon'
import styled from 'styled-components'

export default function RemoveIconButton(props) {
  if (!props.isVisible) {
    return null
  }

  return (
    <CloseIcon onClick={props.onClick} disabled={props.disabled}>
      <Icon className="fas fa-times" iconSize={18} />
    </CloseIcon>
  )
}

const CloseIcon = styled.div`
  cursor: pointer;
  display: inline-block;
  margin-right: -10px;
  margin-top: -10px;
  position: absolute;
  text-align: center;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: rgba(196, 196, 196, 0.75);
  &: hover {
    cursor: point;
  }
`
