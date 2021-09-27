import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import ColorPicker from 'lib/ui/ColorPicker'
import {BackgroundPickerProps} from 'lib/ui/form/BackgroundPicker'
import React from 'react'

export default function SolidColorPicker(
  props: BackgroundPickerProps & {
    onSwitchToGradient: () => void
  },
) {
  const {label, background, onChange, onSwitchToGradient} = props

  return (
    <ColorPicker
      label={label}
      disabled={props.disabled}
      color={background}
      onPick={onChange}
      aria-label="solid background"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={onSwitchToGradient}
              color="primary"
              aria-label="switch to gradient background"
              disabled={props.disabled}
            >
              Gradient
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )
}
