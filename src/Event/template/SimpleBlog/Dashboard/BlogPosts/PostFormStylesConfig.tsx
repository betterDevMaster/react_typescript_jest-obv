import TextField from '@material-ui/core/TextField'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import {onChangeNumberHandler, onUnknownChangeHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import React, {useEffect, useMemo, useState} from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

import {useToggle} from 'lib/toggle'

export default function PostFormStylesConfig() {
  const {flag: isVisible, toggle: togglePostFormStyleConfig} = useToggle()

  const {update} = useSimpleBlog()

  const styles = usePostFormStyles()

  const [width, setWidth] = useState(styles.width)
  const [position, setPosition] = useState(styles.position)
  const [buttonSize, setButtonSize] = useState(styles.buttonSize)
  const [buttonRadius, setButtonRadius] = useState(styles.buttonRadius)
  const [buttonColor, setButtonColor] = useState(styles.buttonColor)
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState(
    styles.buttonBackgroundColor,
  )
  const [buttonHoverBackgroundColor, setButtonHoverBackgroundColor] = useState(
    styles.buttonHoverBackgroundColor,
  )
  const [buttonPosition, setButtonPosition] = useState(styles.buttonPosition)
  const [buttonFontSize, setButtonFontSize] = useState(styles.buttonFontSize)

  const save = () => {
    const updated: SimpleBlog['postFormStyles'] = {
      width,
      position,
      buttonSize,
      buttonRadius,
      buttonColor,
      buttonBackgroundColor,
      buttonHoverBackgroundColor,
      buttonPosition,
      buttonFontSize,
    }
    update.primitive('postFormStyles')(updated)
    togglePostFormStyleConfig()
  }

  useEffect(() => {
    if (isVisible) {
      return
    }
    setWidth(styles.width)
    setPosition(styles.position)
    setButtonSize(styles.buttonSize)
    setButtonRadius(styles.buttonRadius)
    setButtonColor(styles.buttonColor)
    setButtonBackgroundColor(styles.buttonBackgroundColor)
    setButtonHoverBackgroundColor(styles.buttonHoverBackgroundColor)
    setButtonPosition(styles.buttonPosition)
    setButtonFontSize(styles.buttonFontSize)
  }, [isVisible, styles])

  return (
    <>
      <StyledEditPostFormStylesButton onClick={togglePostFormStyleConfig} />

      <ComponentConfig
        isVisible={isVisible}
        onClose={togglePostFormStyleConfig}
        title="Post Form Styles"
      >
        <TextField
          value={width}
          label="Form Width %"
          type="number"
          fullWidth
          inputProps={{
            min: 1,
            max: 100,
          }}
          onChange={onChangeNumberHandler(setWidth)}
        />
        <Box mb={2}>
          <InputLabel>Form Position</InputLabel>
          <Select
            value={position}
            onChange={onUnknownChangeHandler(setPosition)}
            fullWidth
          >
            <MenuItem value="flex-end">Right</MenuItem>
            <MenuItem value="center">Center</MenuItem>
            <MenuItem value="flex-start">Left</MenuItem>
          </Select>
        </Box>
        <TextField
          value={buttonSize}
          label="Form Button Size"
          type="number"
          fullWidth
          inputProps={{
            min: 1,
            max: 100,
          }}
          onChange={onChangeNumberHandler(setButtonSize)}
        />
        <TextField
          value={buttonRadius}
          label="Form Button Radius"
          type="number"
          fullWidth
          inputProps={{
            min: 1,
            max: 50,
          }}
          onChange={onChangeNumberHandler(setButtonRadius)}
        />
        <ColorPicker
          label="Submit Button Text Color"
          color={buttonColor}
          onPick={setButtonColor}
          aria-label="submit button color"
        />
        <ColorPicker
          label="Submit Button Background Color"
          color={buttonBackgroundColor}
          onPick={setButtonBackgroundColor}
          aria-label="submit button background color"
        />
        <ColorPicker
          label="Submit Button Background Hover Color"
          color={buttonHoverBackgroundColor}
          onPick={setButtonHoverBackgroundColor}
          aria-label="submit button background hover color"
        />
        <TextField
          value={buttonFontSize}
          label="Submit Button Font Size"
          type="number"
          fullWidth
          inputProps={{
            min: 0,
            max: 50,
          }}
          onChange={onChangeNumberHandler(setButtonFontSize)}
        />
        <Box mb={2}>
          <InputLabel>Submit Button Position</InputLabel>
          <Select
            value={buttonPosition}
            onChange={onUnknownChangeHandler(setButtonPosition)}
            fullWidth
          >
            <MenuItem value="flex-end">Right</MenuItem>
            <MenuItem value="center">Center</MenuItem>
            <MenuItem value="flex-start">Left</MenuItem>
          </Select>
        </Box>
        <SaveButton onClick={save} />
      </ComponentConfig>
    </>
  )
}
export function usePostFormStyles() {
  const {
    template: {postFormStyles},
  } = useSimpleBlog()

  return useMemo(
    () => ({
      width: postFormStyles.width,
      position: postFormStyles.position,
      buttonSize: postFormStyles.buttonSize,
      buttonRadius: postFormStyles.buttonRadius,
      buttonColor: postFormStyles.buttonColor,
      buttonBackgroundColor: postFormStyles.buttonBackgroundColor,
      buttonHoverBackgroundColor: postFormStyles.buttonHoverBackgroundColor,
      buttonPosition: postFormStyles.buttonPosition,
      buttonFontSize: postFormStyles.buttonFontSize,
    }),
    [postFormStyles],
  )
}

function EditPostFormStylesButton(props: {
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      className={props.className}
      fullWidth
      size="large"
      variant="contained"
      color="primary"
      aria-label="style post form"
      onClick={props.onClick}
    >
      Edit Post Form Styles
    </Button>
  )
}

const StyledEditPostFormStylesButton = styled(EditPostFormStylesButton)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
`
