import {colors} from 'lib/ui/theme'
import React from 'react'
import styled from 'styled-components'

export type ButtonProps = {
  children: JSX.Element | string | JSX.Element[]
  variant: 'text' | 'contained' | 'outlined'
  color: 'default' | 'primary' | 'danger'
}

export default function Button(props: ButtonProps) {
  return (
    <StyledButton
      backgroundColor={backgroundColor(props)}
      color={textColor(props)}
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
`
