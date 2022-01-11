import styled from 'styled-components'
import React, {useRef, useState} from 'react'
import {ColorChangeHandler, ChromePicker} from 'react-color'
import ReactDOM from 'react-dom'
import TextField, {TextFieldProps} from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ColorProperties from 'color'
import {isValidColor, safeColor} from 'lib/color'

export default function ColorPicker(props: {
  label?: string
  color?: string
  onPick: (color: string) => void
  'aria-label'?: string
  disabled?: boolean
  InputProps?: TextFieldProps['InputProps']
}) {
  const [showPicker, setShowPicker] = useState(false)
  const color = safeColor(props.color)
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState('')

  const toggleShowPicker = () => {
    setShowPicker(!showPicker)
  }

  const updateColor = (newColor: string) => {
    setError('')

    if (!isValidColor(newColor)) {
      setError('Invalid Color')
      return
    }

    props.onPick(newColor)
  }
  const handleColorChange: ColorChangeHandler = ({hex: newColor}) => {
    updateColor(newColor)
  }

  // Prevent white text from being invisible
  const fontColor = !color || isWhite(color) ? '#e8e8e8' : color

  const useStyles = makeStyles({
    input: {
      color: fontColor,
    },
  })
  const classes = useStyles()

  return (
    <div>
      <TextField
        InputProps={{
          className: classes.input,
          ...(props.InputProps || {}),
        }}
        disabled={props.disabled}
        value={color}
        label={props.label}
        ref={anchorRef}
        onClick={toggleShowPicker}
        fullWidth
        onChange={onChangeStringHandler(updateColor)}
        inputProps={{
          'aria-label': props['aria-label'],
        }}
        error={!!error}
        helperText={error}
      />
      <Picker
        visible={showPicker}
        color={color}
        onChangeColor={handleColorChange}
        toggle={toggleShowPicker}
        anchor={anchorRef.current}
      />
    </div>
  )
}

export const COLOR_PICKER_POPOVER = 'color-picker-popover'

export function ColorPickerPopover() {
  return <div id={COLOR_PICKER_POPOVER}></div>
}

function Picker(props: {
  visible: boolean
  color?: string
  onChangeColor: ColorChangeHandler
  toggle: () => void
  anchor: HTMLDivElement | null
}) {
  if (!props.visible) {
    return null
  }

  if (!props.anchor) {
    throw new Error('Missing color popover anchor')
  }

  // Render into element OUTSIDE of heirarchy. This allows the picker
  // to have its own z-index, even if rendered from inside
  // a dialog/modal.
  const popoverEl = document.getElementById(COLOR_PICKER_POPOVER)
  if (!popoverEl) {
    throw new Error('Missing color picker popover el')
  }

  const {
    left: anchorLeft,
    top: anchorTop,
    height: anchorHeight,
  } = props.anchor.getBoundingClientRect()

  const topMargin = 8
  const top = anchorTop + anchorHeight + topMargin + window.scrollY

  return ReactDOM.createPortal(
    <Container left={anchorLeft} top={top}>
      <HideOverlay onClick={props.toggle} />
      <ChromePicker
        color={props.color || undefined}
        onChange={props.onChangeColor}
        disableAlpha={true}
      />
    </Container>,
    popoverEl,
  )
}

function isWhite(color: string) {
  try {
    const properties = ColorProperties(color)
    return properties.luminosity() > 0.8
  } catch (_) {
    // Ignore invalid color strings
    return false
  }
}

const Container = styled.div<{left: number; top: number}>`
  position: absolute;
  z-index: 2000;
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};

  /*
  Hide color input on picker since we already have an input,
  and also because React portal breaks mouse events. We 
  need the portal to render pickers inside modals.
  */
  .chrome-picker {
    > div:nth-of-type(2) {
      padding: 16px !important;

      > div:nth-of-type(2) {
        display: none !important;
      }
    }
  }
`

const HideOverlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`
