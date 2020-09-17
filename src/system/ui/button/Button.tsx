import React from 'react'
import styled from 'styled-components'

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  textTransform?: 'uppercase' | 'capitalize'
  backgroundColor?: string
  textColor?: string
  className?: string
  hoverBackgroundColor?: string
  lightOnHover?: boolean
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  hoverBorderColor?: string
}

export default function Button(props: ButtonProps) {
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
    >
      {props.children}
    </StyledButton>
  )
}

function width(props: ButtonProps) {
  if (props.fullWidth) {
    return '100%'
  }

  return 'auto'
}

function textTransform(props: ButtonProps) {
  if (props.textTransform) {
    return props.textTransform
  }

  return 'initial'
}

function padding(props: ButtonProps) {
  return 'auto'
}

function textColor(props: ButtonProps) {
  if (props.textColor) {
    return props.textColor
  }

  return '#FFFFFF'
}

function backgroundColor(props: ButtonProps) {
  if (props.backgroundColor) {
    return props.backgroundColor
  }

  return '#000000'
}

function cursor(props: ButtonProps) {
  return 'pointer'
}

function transition(props: ButtonProps) {
  if (!props.lightOnHover) {
    return 'none'
  }

  return 'opacity 0.2s ease-in-out'
}

function hoverOpacity(props: ButtonProps) {
  if (!props.lightOnHover) {
    return 1
  }

  return 0.8
}

function hoverBackgroundColor(props: ButtonProps) {
  if (props.hoverBackgroundColor) {
    return props.hoverBackgroundColor
  }

  return backgroundColor(props)
}

function borderRadius(props: ButtonProps) {
  if (!props.borderRadius) {
    return '0px'
  }

  return `${props.borderRadius}px`
}

function hoverBorder(props: ButtonProps) {
  if (!props.hoverBorderColor) {
    return border(props)
  }

  return `${props.borderWidth}px solid ${hoverBorderColor(props)}`
}

function border(props: ButtonProps) {
  if (!props.borderWidth) {
    return 'none'
  }

  return `${props.borderWidth}px solid ${borderColor(props)}`
}

function borderColor(props: ButtonProps) {
  if (!props.borderColor) {
    return '#000000'
  }

  return props.borderColor
}

function hoverBorderColor(props: ButtonProps) {
  if (!props.borderColor) {
    return '#000000'
  }

  return props.hoverBorderColor
}

type StyleProps = {
  width: string
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
}

const StyledButton = styled.button<StyleProps>`
  width: ${(props) => props.width};
  text-transform: ${(props) => props.textTransform};
  padding: ${(props) => props.padding};
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  border: ${(props) => props.border};
  cursor: ${(props) => props.cursor};
  transition: ${(props) => props.transition};
  border-radius: ${(props) => props.borderRadius};
  &:hover {
    opacity: ${(props) => props.hoverOpacity};
    background: ${(props) => props.hoverBackgroundColor};
    border: ${(props) => props.hoverBorder};
  }
`
