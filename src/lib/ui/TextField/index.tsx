import React from 'react'
import styled from 'styled-components'
import {onChangeStringHandler} from 'lib/dom'

export type TextFieldProps = {
  variant?: 'filled' | 'outlined'
  fullWidth?: boolean
  dark?: boolean
  rounded?: boolean
  color?: 'default' | 'white'
  label?: string
  type?: 'text' | 'password'
  'aria-label'?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  onChange?: (v: string) => void
}

export default function TextField(props: TextFieldProps) {
  return (
    <StyledInput
      backgroundColor={backgroundColor(props)}
      color={textColor(props)}
      rounded={props.rounded}
      bordered={props.variant === 'outlined'}
      type={props.type || 'text'}
      placeholder={props.placeholder}
      aria-label={props['aria-label']}
      fullWidth={props.fullWidth}
      value={props.value}
      disabled={props.disabled}
      onChange={props.onChange && onChangeStringHandler(props.onChange)}
    />
  )
}

function textColor(props: TextFieldProps) {
  if (props.color === 'white') {
    return '#FFFFFF'
  }

  return '#000000'
}

function backgroundColor(props: TextFieldProps) {
  if (props.dark) {
    return '#353535'
  }

  if (props.variant === 'outlined') {
    return 'transparent'
  }

  if (props.variant === 'filled') {
    return '#DFDFDF'
  }

  return 'transparent'
}

type StyleProps = {
  backgroundColor: string
  color: string
  fullWidth?: boolean
  rounded?: boolean
  bordered?: boolean
}

const StyledInput = styled.input<StyleProps>`
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  height: ${(props) => props.theme.spacing[10]};
  box-sizing: border-box;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[3]}`};
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  border-radius: ${(props) => `${props.rounded ? '24px' : '3px'}`};
  border-width: ${(props) => `${props.bordered ? '1px' : 0}`};
  border-color: #dfdfdf;
  border-style: solid;
  font-weight: 300;
  font-size: 14px;
  line-height: 17px;
`
