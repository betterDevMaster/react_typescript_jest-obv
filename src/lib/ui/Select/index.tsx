import React from 'react'
import styled from 'styled-components'
import {makeStyles} from '@material-ui/styles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import SelectComponent from '@material-ui/core/Select'
import {onUnknownChangeHandler} from 'lib/dom'

const useStyles = makeStyles({
  dropDownLight: {
    backgroundColor: '#FFFFFF',
  },
  dropDownDark: {
    backgroundColor: '#353535',
  },
})

export type SelectBoxProps = {
  fullWidth?: boolean
  disabled?: boolean
  dark?: boolean
  label?: string
  'aria-label'?: string
  value?: string | number
  children: JSX.Element | JSX.Element[]
  onChange: (v: string) => void
}

export default function Select(props: SelectBoxProps) {
  const classes = useStyles()
  const {fullWidth, label, disabled, dark, children, value, onChange} = props

  return (
    <StyledFormControl fullWidth={fullWidth}>
      <StyledInputLabel dark={dark}>{label}</StyledInputLabel>
      <StyledSelect
        value={value || ''}
        inputProps={{
          'aria-label': props['aria-label'],
        }}
        disabled={disabled}
        hasLabel={!!label}
        dark={dark}
        fullWidth
        onChange={onUnknownChangeHandler(onChange)}
        IconComponent={() => <StyledIcon dark={dark} />}
        MenuProps={{
          classes: {paper: dark ? classes.dropDownDark : classes.dropDownLight},
        }}
      >
        {children}
      </StyledSelect>
    </StyledFormControl>
  )
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 0 !important;
`

type StyleProps = {
  hasLabel?: boolean
  dark?: boolean
}

const StyledInputLabel = styled(InputLabel)<StyleProps>`
  transform: unset !important;
  font-size: 17px !important;
  line-height: 18px !important;
  font-weight: 500 !important;
  color: ${(props) => (props.dark ? '#FFFFFF' : '#000000')} !important;
  & + .Mui-focused {
    color: ${(props) => (props.dark ? '#FFFFFF' : '#000000')} !important;
  }
`

const StyledSelect = styled(SelectComponent)<StyleProps>`
  height: 48px;
  border: ${(props) => (props.dark ? 'none' : '1px solid #DFDFDF')};
  border-radius: 4px;
  background-color: ${(props) => (props.dark ? '#353535' : '#FFFFFF')};
  margin-top: ${(props) => (props.hasLabel ? '30px' : 'unset')} !important;
  div:first-child {
    padding-right: 0;
    padding-left: 12px;
    color: ${(props) => (props.dark ? '#FFFFFF' : '#000000')};
    :focus {
      background-color: ${(props) =>
        props.dark ? '#353535' : '#FFFFFF'} !important;
    }
  }
  ::before {
    border-bottom-width: 0 !important;
  }
  ::after {
    border-bottom-width: 0 !important;
  }
`

const StyledIcon = styled(KeyboardArrowDownIcon)<StyleProps>`
  margin: 0 12px;
  color: ${(props) => (props.dark ? '#FFFFFF' : '#333333')};
`
