import styled from 'styled-components'
import React, {useEffect, useState} from 'react'
import BackButton from 'lib/ui/Button/BackButton'
import Box from '@material-ui/core/Box'
import DangerButton from 'lib/ui/Button/DangerButton'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import {
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import Grid from '@material-ui/core/Grid'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TargetConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'
import NavButton from 'Event/Dashboard/components/NavButton'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 50

export const DEFAULT_BUTTON_WIDTH_PERCENT = 100

export default function ButtonConfig(props: {
  onClose: () => void
  onChange: (button: NavButton) => void
  onRemove: () => void
  button: NavButton
}) {
  const {button, onChange, onClose} = props

  const [backgroundColor, setBackgroundColor] = useState(button.backgroundColor)
  const [buttonIsVisible, setButtonIsVisible] = useState(button.isVisible)
  const [text, setText] = useState(button.text)
  const [actionId, setActionId] = useState(button.actionId)
  const [isAreaButton, setIsAreaButton] = useState(button.isAreaButton)
  const [areaId, setAreaId] = useState(button.areaId)
  const [link, setLink] = useState(button.link)
  const [page, setPage] = useState(button.page)
  const [newTab, setNewTab] = useState(button.newTab)
  const [width, setWidth] = useState(button.width)
  const [textColor, setTextColor] = useState(button.textColor)
  const [borderColor, setBorderColor] = useState(button.borderColor)
  const [borderRadius, setBorderRadius] = useState(button.borderRadius)
  const [borderWidth, setBorderWidth] = useState(button.borderWidth)
  const [padding, setPadding] = useState(button.padding)
  const [fontSize, setFontSize] = useState(button.fontSize)
  const [infusionsoftTag, setInfusionsoftTag] = useState(button.infusionsoftTag)

  useEffect(() => {
    setActionId(button.actionId)
    setButtonIsVisible(button.isVisible)
    setText(button.text)
    setIsAreaButton(button.isAreaButton)
    setAreaId(button.areaId)
    setLink(button.link)
    setPage(button.page)
    setNewTab(button.newTab)
    setWidth(button.width)
    setBackgroundColor(button.backgroundColor)
    setTextColor(button.textColor)
    setBorderColor(button.borderColor)
    setBorderRadius(button.borderRadius)
    setBorderWidth(button.borderWidth)
    setPadding(button.padding)
    setFontSize(button.fontSize)
    setInfusionsoftTag(button.infusionsoftTag)
  }, [button])

  const save = () => {
    const data: NavButton = {
      backgroundColor,
      isVisible: buttonIsVisible,
      text,
      actionId,
      isAreaButton,
      areaId,
      link,
      page,
      newTab,
      width,
      textColor,
      borderColor,
      borderRadius,
      borderWidth,
      padding,
      fontSize,
      infusionsoftTag,
    }

    onChange(data)
    onClose()
  }

  return (
    <>
      <StyledBackButton onClick={onClose} />
      <Box mb={3}>
        <Switch
          checked={buttonIsVisible}
          onChange={onChangeCheckedHandler(setButtonIsVisible)}
          arial-label="config switch to attendee"
          labelPlacement="end"
          color="primary"
          label={button.isVisible ? 'Enable' : 'Disable'}
        />
        <TextField
          label="Text"
          name="text"
          value={text}
          onChange={onChangeStringHandler(setText)}
          inputProps={{
            'aria-label': 'button name input',
          }}
          fullWidth
        />
        <ActionSelect value={actionId} onChange={setActionId} />
        <TargetConfig
          disablePageSelect
          isAreaButton={isAreaButton}
          setIsAreaButton={setIsAreaButton}
          areaId={areaId}
          setAreaId={setAreaId}
          link={link}
          setLink={setLink}
          page={page}
          setPage={setPage}
          newTab={newTab}
          setNewTab={setNewTab}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel>Width</InputLabel>
            <Slider
              min={0}
              max={100}
              step={1}
              onChange={handleChangeSlider(setWidth)}
              valueLabelDisplay="auto"
              value={width}
              aria-label="button width"
            />
          </Grid>
          <Grid item xs={6}>
            <BackgroundPicker
              label="Background Color"
              background={backgroundColor}
              onChange={setBackgroundColor}
            />
          </Grid>
          <Grid item xs={6}>
            <ColorPicker
              label="Text Color"
              color={textColor}
              onPick={setTextColor}
              aria-label="text color color"
            />
          </Grid>
          <Grid item xs={6}>
            <ColorPicker
              label="Border Color"
              color={borderColor}
              onPick={setBorderColor}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={borderRadius || 0}
              label="Border Radius"
              onChange={onChangeNumberHandler(setBorderRadius)}
              type="number"
              fullWidth
              inputProps={{
                min: MIN_BORDER_RADIUS,
                max: MAX_BORDER_RADIUS,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Border Thickness</InputLabel>
            <TextField
              name="borderWidth"
              value={borderWidth || 0}
              onChange={onChangeNumberHandler(setBorderWidth)}
              label="Border Width"
              type="number"
              fullWidth
              inputProps={{
                min: MIN_BORDER_WIDTH,
                max: MAX_BORDER_WIDTH,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={padding || 0}
              onChange={onChangeNumberHandler(setPadding)}
              label="Padding"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={fontSize || ''}
              onChange={onChangeNumberHandler(setFontSize)}
              label="Font Size"
              type="number"
              fullWidth
            />
          </Grid>
        </Grid>
        <InfusionsoftTagInput
          value={infusionsoftTag}
          onChange={setInfusionsoftTag}
        />
      </Box>
      <Box mb={2}>
        <Button color="primary" variant="outlined" onClick={save} fullWidth>
          DONE
        </Button>
      </Box>
      <Box mb={2}>
        <DangerButton
          fullWidth
          variant="outlined"
          aria-label="remove button"
          onClick={props.onRemove}
        >
          REMOVE BUTTON
        </DangerButton>
      </Box>
    </>
  )
}

const StyledBackButton = styled(BackButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
