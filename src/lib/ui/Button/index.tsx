import {colors} from 'lib/ui/theme'
import React from 'react'
import styled from 'styled-components'
import Box from 'lib/ui/Box'

type ButtonStyles =
  | 'primary'
  | 'danger'
  | 'success'
  | 'info'
  | 'warning'
  | 'secondary'
  | 'light'
  | 'dark'
  | 'accent'
  | 'grey'
  | 'default'

const DEFAULT_FONT_SIZE = 14

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
  borderWidth?: number
  disableBorderRadius?: boolean
  disablePadding?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
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
      borderWidth={getBorderWidth(props)}
      fontSize={props.fontSize || DEFAULT_FONT_SIZE}
      disableBorderRadius={Boolean(props.disableBorderRadius)}
      disablePadding={props.disablePadding}
      hasBorder={hasBorder(props)}
    >
      <IconBox isStartIcon={true}>{props.startIcon}</IconBox>
      {props.children}
      <IconBox isStartIcon={false}>{props.endIcon}</IconBox>
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
  if (props.variant === 'contained') {
    return textColor(props)
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
  if (props.color === 'accent') {
    return colors.accent
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
  if (props.color === 'grey') {
    return colors.grey500
  }
  return '#e7e7e7'
}

function hasBorder(props: ButtonProps) {
  if (props.variant === 'contained' || props.variant === 'text') {
    return false
  }
  return true
}

function getBorderWidth(props: ButtonProps) {
  if (hasBorder(props) === false) {
    return 0
  }
  return props.borderWidth || 1
}

type StyleProps = {
  color: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  fullWidth?: boolean
  width: string
  fontSize: number
  disableBorderRadius: boolean
  disablePadding?: boolean
  hasBorder: boolean
}

const StyledButton = styled.button<StyleProps>`
  display: inline-flex;
  padding: ${(props) =>
    props.disablePadding
      ? 'unset'
      : `${props.theme.spacing[2]} ${props.theme.spacing[8]}`};
  color: ${(props) => props.color};
  border: ${(props) => `${props.borderWidth}px solid ${props.borderColor}`};
  border-radius: 3px;
  background-color: ${(props) => props.backgroundColor};
  width: ${(props) => (props.fullWidth ? '100%' : props.width)};
  border-radius: ${(props) => (props.disableBorderRadius ? '0px' : '4px')};
  font-size: ${(props) => props.fontSize}px;
  justify-content: center;
  line-height: 24px;
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

function IconBox(props: {children?: React.ReactNode; isStartIcon: boolean}) {
  if (!props.children) {
    return null
  }
  if (!props.isStartIcon) {
    return <Box pl={1}>{props.children}</Box>
  }
  return <Box pr={1}>{props.children}</Box>
}
