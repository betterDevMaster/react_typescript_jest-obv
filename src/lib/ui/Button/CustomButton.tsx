import {grey} from '@material-ui/core/colors'
import React from 'react'
import styled from 'styled-components'

export interface CustomButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  textTransform?: 'uppercase' | 'capitalize'
  backgroundColor?: string
  textColor?: string
  className?: string
  hoverBackgroundColor?: string
  disableHover?: boolean
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  hoverBorderColor?: string
  variant?: 'text'
  opacity?: number
  height?: number
  minHeight?: number
  type?: 'submit' | 'button' | 'reset'
  width?: number
  fontSize?: number
  padding?: number
  'aria-label'?: string
}

export default function CustomButton(props: CustomButtonProps) {
  return (
    <StyledButton
      width={width(props)}
      textTransform={textTransform(props)}
      padding={padding(props)}
      backgroundColor={backgroundColor(props)}
      color={textColor(props)}
      border={border(props)}
      cursor={cursor(props)}
      transition={transition(props)}
      hoverOpacity={hoverOpacity(props)}
      hoverBackgroundColor={hoverBackgroundColor(props)}
      borderRadius={borderRadius(props)}
      className={props.className}
      hoverBorder={hoverBorder(props)}
      hoverTextDecoration={hoverTextDecoration(props)}
      onClick={props.onClick}
      aria-label={props['aria-label']}
      opacity={opacity(props)}
      height={height(props)}
      minHeight={minHeight(props)}
      fontSize={fontSize(props)}
      type={props.type || 'button'}
    >
      {props.children}
    </StyledButton>
  )
}

function width(props: CustomButtonProps) {
  if (props.width) {
    return `${props.width}%`
  }

  if (props.fullWidth) {
    return '100%'
  }

  return 'auto'
}

function height(props: CustomButtonProps) {
  if (!props.height) {
    return 'auto'
  }

  return props.height + 'px'
}

function minHeight(props: CustomButtonProps) {
  if (!props.minHeight) {
    return 'auto'
  }

  return props.minHeight + 'px'
}

function textTransform(props: CustomButtonProps) {
  if (props.textTransform) {
    return props.textTransform
  }

  return 'initial'
}

function padding(props: CustomButtonProps) {
  if (props.padding) {
    return `${props.padding}px!important`
  }

  if (isText(props.variant)) {
    return '0'
  }

  return 'inherit'
}

function textColor(props: CustomButtonProps) {
  if (props.disabled) {
    return grey[500]
  }

  if (props.textColor) {
    return props.textColor
  }

  if (isText(props.variant)) {
    return 'inherit'
  }

  return '#FFFFFF'
}

function backgroundColor(props: CustomButtonProps) {
  if (isText(props.variant)) {
    return 'transparent'
  }

  if (props.backgroundColor) {
    return props.backgroundColor
  }

  return '#000000'
}

function cursor(props: CustomButtonProps) {
  if (props.disabled) {
    return 'not-allowed'
  }

  return 'pointer'
}

function transition(props: CustomButtonProps) {
  if (props.disableHover || props.variant === 'text') {
    return 'none'
  }

  return 'opacity 0.2s ease-in-out'
}

function hoverOpacity(props: CustomButtonProps) {
  if (props.disableHover || props.variant === 'text') {
    return 1
  }

  return 0.8
}

function hoverBackgroundColor(props: CustomButtonProps) {
  if (props.hoverBackgroundColor && !props.disableHover) {
    return props.hoverBackgroundColor
  }

  return backgroundColor(props)
}

function borderRadius(props: CustomButtonProps) {
  if (!props.borderRadius) {
    return '0px'
  }

  return `${props.borderRadius}px`
}

function hoverBorder(props: CustomButtonProps) {
  if (!props.hoverBorderColor || props.disableHover) {
    return border(props)
  }

  return `${props.borderWidth}px solid ${hoverBorderColor(props)}`
}

function border(props: CustomButtonProps) {
  if (!props.borderWidth) {
    return 'none'
  }

  return `${props.borderWidth}px solid ${borderColor(props)}`
}

function borderColor(props: CustomButtonProps) {
  if (!props.borderColor) {
    return '#000000'
  }

  return props.borderColor
}

function hoverBorderColor(props: CustomButtonProps) {
  if (!props.borderColor) {
    return '#000000'
  }

  return props.hoverBorderColor
}

function hoverTextDecoration(props: CustomButtonProps) {
  if (isText(props.variant) && !props.disableHover) {
    return 'underline'
  }

  return 'none'
}

function isText(variant: CustomButtonProps['variant']) {
  return variant === 'text'
}

function fontSize(props: CustomButtonProps) {
  if (props.fontSize) {
    return `${props.fontSize}px`
  }
}

function opacity(props: CustomButtonProps) {
  if (props.opacity === undefined) {
    return 1
  }

  return props.opacity
}

type StyleProps = {
  width: string
  height: string
  minHeight: string
  textTransform: string
  padding: string
  backgroundColor: string
  color: string
  border: string
  cursor: string
  transition: string
  hoverOpacity: number
  hoverBackgroundColor: string
  borderRadius: string
  hoverBorder: string
  hoverTextDecoration: string
  opacity: number
  fontSize?: string
}

const StyledButton = styled.button<StyleProps>`
  width: ${(props) => props.width};
  text-transform: ${(props) => props.textTransform};
  padding: ${(props) => props.padding};
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  border: ${(props) => props.border};
  cursor: ${(props) => props.cursor};
  transition: ${(props) => props.transition};
  border-radius: ${(props) => props.borderRadius};
  opacity: ${(props) => props.opacity};
  height: ${(props) => props.height} !important;
  min-height: ${(props) => props.minHeight} !important;
  ${(props) =>
    props.fontSize ? `font-size: ${props.fontSize}!important;` : ''}
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: ${(props) => props.hoverOpacity};
    background: ${(props) => props.hoverBackgroundColor};
    border: ${(props) => props.hoverBorder};
    text-decoration: ${(props) => props.hoverTextDecoration};
  }
`
