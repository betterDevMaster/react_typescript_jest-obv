import React from 'react'
import {withStyles, Theme} from '@material-ui/core/styles'
import SwitchComponent from '@material-ui/core/Switch'
import {onChangeCheckedHandler} from 'lib/dom'

const StyledSwitch = withStyles((theme: Theme) => ({
  root: {
    width: 37,
    height: 20,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 16,
    height: 16,
    boxShadow: 'none',
    backgroundColor: theme.palette.common.white,
  },
  track: {
    border: 'none',
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor: 'rgba(58, 58, 58, 0.4)',
  },
  checked: {},
}))(SwitchComponent)

export default function Switch(props: {
  checked: boolean
  handleChange: (value: boolean) => void
}) {
  const {checked, handleChange} = props

  return (
    <StyledSwitch
      checked={checked}
      onChange={onChangeCheckedHandler(handleChange)}
    />
  )
}
