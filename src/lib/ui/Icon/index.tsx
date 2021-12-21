import {colors} from 'lib/ui/theme'
import React from 'react'
import styled from 'styled-components'

export type IconProps = {
  className?: string
  color?: string
  iconSize: number
  onClick?: () => {}
}

export default function Icon(props: IconProps) {
  return (
    <StyledIcon
      className={props.className}
      iconSize={props.iconSize}
      color={textColor(props.color)}
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

  return color ? color : '#000000'
}

const StyledIcon = styled.i<IconProps>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.iconSize}px;
`
