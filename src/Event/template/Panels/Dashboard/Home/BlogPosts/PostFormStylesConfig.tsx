import TextField from '@material-ui/core/TextField'
import {Panels, usePanels} from 'Event/template/Panels'
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

  const {update} = usePanels()

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

  const [labelColor, setLabelColor] = useState(styles.formStyle.labelColor)
  const [inputBoxBorderColor, setInputBoxBorderColor] = useState(
    styles.formStyle.borderColor,
  )
  const [inputBoxBackgroundColor, setInputBoxBackgroundColor] = useState(
    styles.formStyle.backgroundColor,
  )
  const [inputBoxBackgroundOpacity, setInputBoxBackgroundOpacity] = useState(
    styles.formStyle.backgroundOpacity,
  )
  const [inputBoxColor, setInputBoxColor] = useState(styles.formStyle.textColor)
  const [helperTextColor, setHelperTextColor] = useState(
    styles.formStyle.helperTextColor,
  )

  const save = () => {
    const updated: Panels['postFormStyles'] = {
      width,
      position,
      buttonSize,
      buttonRadius,
      buttonColor,
      buttonBackgroundColor,
      buttonHoverBackgroundColor,
      buttonPosition,
      buttonFontSize,
      inputStyles: {
        labelColor,
        borderColor: inputBoxBorderColor,
        backgroundColor: inputBoxBackgroundColor,
        backgroundOpacity: inputBoxBackgroundOpacity,
        textColor: inputBoxColor,
        helperTextColor,
      },
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

    setLabelColor(styles.formStyle.labelColor)
    setInputBoxBorderColor(styles.formStyle.borderColor)
    setInputBoxBackgroundColor(styles.formStyle.backgroundColor)
    setInputBoxBackgroundOpacity(styles.formStyle.backgroundOpacity)
    setInputBoxColor(styles.formStyle.textColor)
    setHelperTextColor(styles.formStyle.helperTextColor)
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
        <ColorPicker
          label="Label Text Color"
          color={labelColor}
          onPick={setLabelColor}
          aria-label="latel text color"
        />
        <ColorPicker
          label="Input Border Color"
          color={inputBoxBorderColor}
          onPick={setInputBoxBorderColor}
          aria-label="input box border color"
        />
        <ColorPicker
          label="Input Background Color"
          color={inputBoxBackgroundColor}
          onPick={setInputBoxBackgroundColor}
          aria-label="input box background color"
        />
        <TextField
          value={inputBoxBackgroundOpacity}
          label="Input Background Color Opacity"
          type="number"
          fullWidth
          inputProps={{
            min: 1,
            max: 100,
          }}
          onChange={onChangeNumberHandler(setInputBoxBackgroundOpacity)}
        />
        <ColorPicker
          label="Input Text Color"
          color={inputBoxColor}
          onPick={setInputBoxColor}
          aria-label="input box text color"
        />
        <ColorPicker
          label="Helper Text Color"
          color={helperTextColor}
          onPick={setHelperTextColor}
          aria-label="helper text color"
        />
        <TextField
          value={buttonSize}
          label="Form Button Size %"
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
  } = usePanels()

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
      formStyle: postFormStyles.inputStyles,
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
