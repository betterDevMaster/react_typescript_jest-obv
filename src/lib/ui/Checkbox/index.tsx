import React from 'react'
import styled from 'styled-components'
import {Label as Typography} from 'lib/ui/typography'
import {onChangeCheckedHandler} from 'lib/dom'

export type CheckboxProps = {
  className?: string
  label: string
  value?: any
  checked?: boolean
  disabled?: boolean
  'aria-label'?: string
  onChange?: (v: boolean) => void
}

export default function Checkbox(props: CheckboxProps) {
  const {label, value, checked, disabled, onChange} = props

  return (
    <Label className={props.className}>
      {label}
      <Input
        type="checkbox"
        value={value}
        aria-label={props['aria-label']}
        checked={checked}
        disabled={disabled}
        onChange={onChange && onChangeCheckedHandler(onChange)}
      />
      <Span />
    </Label>
  )
}

const Label = styled(Typography)`
  display: block;
  position: relative;
  padding-left: 32px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &::hover {
    + span {
      background-color: #ccc;
    }
  }
  input:checked {
    + span {
      background-color: #3490dc;
      &::after {
        display: block;
      }
    }
  }
`

const Input = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`

const Span = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  border: 1px solid #3490dc;
  border-radius: 4px;
  &:after {
    content: '';
    position: absolute;
    display: none;
    left: 6px;
    top: 3px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`
