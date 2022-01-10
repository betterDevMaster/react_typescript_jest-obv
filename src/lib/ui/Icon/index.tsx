import {colors} from 'lib/ui/theme'
import React from 'react'
import styled from 'styled-components'

export type IconProps = {
  className?: string
  color?: string
  iconSize?: number
  onClick?: () => void
}

export default function Icon(props: IconProps) {
  return (
    <StyledIcon
      className={props.className}
      iconSize={props.iconSize}
      color={textColor(props.color)}
      onClick={props.onClick}
    />
  )
}

function textColor(color?: string) {
  if (color === 'danger') {
    return colors.error
  }

  if (color === 'primary') {
    return colors.primary
  }

  return color ? color : 'unset'
}

const StyledIcon = styled.i<IconProps>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.iconSize}px;
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
`
