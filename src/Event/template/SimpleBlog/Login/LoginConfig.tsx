import React, {useEffect, useState} from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import {spacing} from 'lib/ui/theme'
import ColorPicker from 'lib/ui/ColorPicker'
import {useTemplate, useUpdatePrimitive} from 'Event/TemplateProvider'
import {onChangeStringHandler} from 'lib/dom'

export default function LoginFormConfig() {
  const template = useTemplate()
  const {login} = template

  const updateLogin = useUpdatePrimitive('login')

  const [submitLabel, setSubmitLabel] = useState(login.submitButton.label)
  const [submitBackgroundColor, setSubmitBackgroundColor] = useState(
    login.submitButton.backgroundColor,
  )
  const [submitTextColor, setSubmitTextColor] = useState(
    login.submitButton.textColor,
  )
  const [descriptionText, setDescriptionText] = useState(login.description.text)
  const [descriptionColor, setDescriptionColor] = useState(
    login.description.color,
  )
  const [descriptionFontSize, setDescriptionFontSize] = useState(
    login.description.fontSize,
  )

  useEffect(() => {
    const hasChanges =
      login.submitButton.label !== submitLabel ||
      login.submitButton.backgroundColor !== submitBackgroundColor ||
      login.submitButton.textColor !== submitTextColor ||
      login.description.color !== descriptionColor ||
      login.description.fontSize !== descriptionFontSize ||
      login.description.text !== descriptionText

    if (!hasChanges) {
      return
    }

    updateLogin({
      submitButton: {
        label: submitLabel,
        backgroundColor: submitBackgroundColor,
        textColor: submitTextColor,
      },
      description: {
        text: descriptionText,
        color: descriptionColor,
        fontSize: descriptionFontSize,
      },
    })
  }, [
    login,
    submitLabel,
    submitBackgroundColor,
    submitTextColor,
    descriptionColor,
    descriptionFontSize,
    descriptionText,
    updateLogin,
  ])

  const handleChangeSlider = (
    evt: React.ChangeEvent<{}>,
    value: number | number[],
  ) => {
    setDescriptionFontSize(value as number)
  }

  return (
    <>
      <Box display="flex" flexDirection="row" flex="2">
        <Box m={1} display="flex" flexDirection="column" flex="1">
          <TextField
            label="Submit Label"
            value={submitLabel}
            onChange={onChangeStringHandler(setSubmitLabel)}
            inputProps={{'aria-label': 'description text'}}
          />
          <ColorPicker
            label="Submit Button Background Color"
            color={submitBackgroundColor}
            onPick={setSubmitBackgroundColor}
            aria-label="submit button background color"
          />
          <ColorPicker
            label="Submit Button Color"
            color={submitTextColor}
            onPick={setSubmitTextColor}
            aria-label="submit button color"
          />
          <TextField
            id="description-text"
            label="Description Text"
            defaultValue={descriptionText}
            onChange={onChangeStringHandler(setDescriptionText)}
            inputProps={{'aria-label': 'description text'}}
          />
          <ColorPicker
            label="Description Text Color"
            color={descriptionColor}
            onPick={setDescriptionColor}
            aria-label="description text color"
          />
          <Typography variant="subtitle2" style={{opacity: 0.7}}>
            Description Font Size
          </Typography>
          <StyledSlider
            valueLabelDisplay="auto"
            aria-label="description font size"
            defaultValue={!descriptionFontSize ? descriptionFontSize : 20}
            onChangeCommitted={handleChangeSlider}
            step={1}
            min={5}
            max={50}
          />
        </Box>
      </Box>
    </>
  )
}

const StyledSlider = withStyles({
  active: {},
  valueLabel: {
    left: `calc( -50% + ${spacing[1]} )`,
  },
  track: {
    height: spacing[2],
    borderRadius: spacing[1],
  },
  rail: {
    height: spacing[2],
    borderRadius: spacing[1],
  },
})(Slider)
