import {colors} from 'lib/ui/theme'
import React from 'react'
import styled from 'styled-components'

type ButtonStyles =
  | 'primary'
  | 'danger'
  | 'success'
  | 'info'
  | 'warning'
  | 'secondary'
  | 'light'
  | 'dark'
  | 'default'

const DEFAULT_FONT_SIZE = 20

export type ButtonProps = {
  children: React.ReactNode | React.ReactNode[] | string
  variant: 'text' | 'contained' | 'outlined'
  color: ButtonStyles
  className?: string
  autoFocus?: boolean
  fullWidth?: boolean
  disabled?: boolean
  width?: number
  fontSize?: number
  disableBorderRadius?: boolean
  disablePadding?: boolean
  onClick?: () => void
  'aria-label'?: string
}

export default function Button(props: ButtonProps) {
  return (
    <StyledButton
      className={props.className}
      backgroundColor={backgroundColor(props)}
      color={textColor(props)}
      onClick={props.onClick}
      borderColor={borderColor(props)}
      autoFocus={props.autoFocus}
      aria-label={props['aria-label']}
      disabled={props.disabled}
      fullWidth={props.fullWidth}
      width={props.width ? `${props.width}%` : 'unset'}
      fontSize={props.fontSize || DEFAULT_FONT_SIZE}
      disableBorderRadius={Boolean(props.disableBorderRadius)}
      disablePadding={props.disablePadding}
      hasBorder={hasBorder(props)}
    >
      {props.children}
    </StyledButton>
  )
}

function textColor(props: ButtonProps) {
  if (props.variant === 'outlined') {
    return getColor(props)
  }

  if (props.variant === 'text') {
    return getColor(props)
  }

  if (props.color === 'light') {
    return '#000000'
  }

  if (props.color === 'default') {
    return '#000000'
  }

  if (props.color === 'warning') {
    return '#000000'
  }

  return '#ffffff'
}

function backgroundColor(props: ButtonProps) {
  if (props.variant === 'outlined') {
    return '#FFFFFF'
  }

  if (props.variant === 'text') {
    return 'transparent'
  }

  return getColor(props)
}

function borderColor(props: ButtonProps) {
  if (props.variant === 'text') {
    return 'transparent'
  }
  return getColor(props)
}

function getColor(props: ButtonProps) {
  if (props.color === 'danger') {
    return colors.error
  }

  if (props.color === 'primary') {
    return colors.primary
  }

  if (props.color === 'success') {
    return colors.success
  }

  if (props.color === 'info') {
    return colors.info
  }

  if (props.color === 'warning') {
    return colors.warning
  }
  if (props.color === 'secondary') {
    return colors.secondary
  }
  if (props.color === 'light') {
    return '#FFFFFF'
  }
  if (props.color === 'dark') {
    return '#000000'
  }

  return '#e7e7e7'
}

function hasBorder(props: ButtonProps) {
  if (props.variant === 'contained' || props.variant === 'text') {
    return false
  }
  return true
}

type StyleProps = {
  color: string
  backgroundColor: string
  borderColor: string
  fullWidth?: boolean
  width: string
  fontSize: number
  disableBorderRadius: boolean
  disablePadding?: boolean
  hasBorder: boolean
}

const StyledButton = styled.button<StyleProps>`
  padding: ${(props) =>
    props.disablePadding
      ? 'unset'
      : `${props.theme.spacing[2]} ${props.theme.spacing[8]}`};
  color: ${(props) => props.color};
  border: ${(props) => (props.hasBorder ? `1px solid ${props.color}` : 'none')};
  border-radius: 3px;
  background-color: ${(props) => props.backgroundColor};
  width: ${(props) => (props.fullWidth ? '100%' : props.width)};
  border-radius: ${(props) => (props.disableBorderRadius ? '0px' : '4px')};
  border-style: solid;
  border-color: ${(props) => props.borderColor};
  font-size: ${(props) => props.fontSize}px;
  &:hover {
    cursor: pointer;
    filter: brightness(0.95);
  }
  &:disabled {
    background-color: #e7e7e7;
    border-color: #e7e7e7;
    color: #666666;
    filter: brightness(1);
    cursor: default;
  }
`
