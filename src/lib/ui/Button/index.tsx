import {colors} from 'lib/ui/theme'
import React from 'react'
import styled from 'styled-components'

export type ButtonProps = {
  children: JSX.Element | string | JSX.Element[]
  variant: 'text' | 'contained' | 'outlined'
  color: 'default' | 'primary' | 'danger' | 'info'
  autoFocus?: boolean
  onClick?: () => void
  'aria-label'?: string
}

export default function Button(props: ButtonProps) {
  return (
    <StyledButton
      backgroundColor={backgroundColor(props)}
      color={textColor(props)}
      onClick={props.onClick}
      autoFocus={props.autoFocus}
      aria-label={props['aria-label']}
    >
      {props.children}
    </StyledButton>
  )
}

function textColor(props: ButtonProps) {
  if (props.variant === 'contained') {
    return '#FFFFFF'
  }

  if (props.color === 'danger') {
    return colors.error
  }

  if (props.color === 'primary') {
    return colors.primary
  }

  if (props.color === 'info') {
    return colors.info
  }

  return '#000000'
}

function backgroundColor(props: ButtonProps) {
  if (props.variant === 'outlined') {
    return '#FFFFFF'
  }

  if (props.variant === 'text') {
    return '#FFFFFF'
  }

  if (props.color === 'danger') {
    return colors.error
  }

  if (props.color === 'primary') {
    return colors.primary
  }

  return '#e7e7e7'
}

type StyleProps = {
  color: string
  backgroundColor: string
}

const StyledButton = styled.button<StyleProps>`
  padding: ${(props) => `${props.theme.spacing[2]} ${props.theme.spacing[8]}`};
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  margin: ${(props) => `${props.theme.spacing[2]}`};
  &:hover {
    cursor: pointer;
  }
`
