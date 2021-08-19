import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import {onChangeNumberHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import {BackgroundPickerProps} from 'lib/ui/form/BackgroundPicker'
import React from 'react'

type GradientValues = {
  degrees: number
  color1: string
  color2: string
}

export const DEFAULT_GRADIENT_VALUE: GradientValues = {
  degrees: 0,
  color1: '#FFFFFF',
  color2: '#FFFFFF',
}

export default function GradientColorPicker(
  props: BackgroundPickerProps & {
    onSwitchToSolid: () => void
  },
) {
  const {label, background, onChange, onSwitchToSolid} = props

  const values = parseValues(background)
  const {degrees, color1, color2} = values

  const set = (key: keyof GradientValues) => (val: string | number) => {
    const background = {
      degrees,
      color1,
      color2,
      [key]: val,
    }

    const updated = `linear-gradient(${background.degrees}deg,${background.color1},${background.color2})`
    onChange(updated)
  }

  return (
    <>
      <TextField
        type="number"
        value={degrees}
        label={`${label} - Gradient Degrees`}
        inputProps={{
          'aria-label': 'gradient degrees',
        }}
        disabled={props.disabled}
        fullWidth
        onChange={onChangeNumberHandler(set('degrees'))}
      />
      <ColorPicker
        label={`${label} - Gradient Color 1`}
        color={color1}
        onPick={set('color1')}
        aria-label="gradient color 1"
        disabled={props.disabled}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                onClick={onSwitchToSolid}
                color="primary"
                aria-label="switch to solid background"
              >
                Solid
              </Button>
            </InputAdornment>
          ),
        }}
      />
      <ColorPicker
        label={`${label} - Gradient Color 1`}
        aria-label="gradient color 2"
        color={color2}
        disabled={props.disabled}
        onPick={set('color2')}
      />
    </>
  )
}

export function parseValues(background?: string): GradientValues {
  if (!background) {
    return DEFAULT_GRADIENT_VALUE
  }

  const gradientRegex = /linear-gradient\((.*)\)/

  const isGradient = gradientRegex.test(background)
  if (!isGradient) {
    return DEFAULT_GRADIENT_VALUE
  }

  const matches = background.match(gradientRegex)
  if (!matches || matches.length !== 2) {
    return DEFAULT_GRADIENT_VALUE
  }

  /**
   * Parse values out of the background CSS style
   */
  const [bgDegrees, bgColor1, bgColor2] = matches[1].split(',')

  const degreesInt = parseInt(bgDegrees)
  const degrees = isNaN(degreesInt) ? 0 : degreesInt

  return {
    degrees,
    color1: bgColor1.trim(),
    color2: bgColor2.trim(),
  }
}
