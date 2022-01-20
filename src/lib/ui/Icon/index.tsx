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

export function ChevronIcon(props: IconProps) {
  return <Icon {...props} className="fas fa-chevron-down" />
}

export function MenuIcon(props: IconProps) {
  return <Icon {...props} className="fas fa-ellipsis-h" />
}

export function PlusIcon(props: IconProps) {
  return <Icon {...props} className="fas fa-plus" />
}

export function MinusIcon(props: IconProps) {
  return <Icon {...props} className="fas fa-minus" />
}

function textColor(color?: string) {
  if (color === 'danger') {
    return colors.error
  }

  if (color === 'primary') {
    return colors.primary
  }
  if (color === 'light') {
    return '#ffffff'
  }

  return color ? color : 'unset'
}

const StyledIcon = styled.i<IconProps>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.iconSize}px;
`
