import styled from 'styled-components'
import React from 'react'
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

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 50

export const DEFAULT_BUTTON_WIDTH_PERCENT = 100

export default function ButtonConfig(props: {
  onClose: () => void
  onChange: (button: NavButton) => void
  onRemove: () => void
  button: NavButton | null
}) {
  const {button} = props
  if (!button) {
    return null
  }

  const updateButton =
    <T extends keyof NavButton>(key: T) =>
    (value: NavButton[T]) =>
      props.onChange({
        ...button,
        [key]: value,
      })

  return (
    <>
      <StyledBackButton onClick={props.onClose} />
      <Box mb={3}>
        <Switch
          checked={button.isVisible}
          onChange={onChangeCheckedHandler(updateButton('isVisible'))}
          arial-label="config visible switch"
          labelPlacement="end"
          color="primary"
          label={button.isVisible ? 'Enable' : 'Disable'}
        />
        <TextField
          label="Text"
          value={button.text}
          inputProps={{
            'aria-label': 'button name input',
          }}
          fullWidth
          onChange={onChangeStringHandler(updateButton('text'))}
        />
        <ActionSelect
          value={button.actionId}
          onChange={updateButton('actionId')}
        />
        <TargetConfig update={updateButton} button={button} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel>Width</InputLabel>
            <Slider
              min={0}
              max={100}
              step={1}
              onChange={handleChangeSlider(updateButton('width'))}
              valueLabelDisplay="auto"
              value={button.width || DEFAULT_BUTTON_WIDTH_PERCENT}
              aria-label="button width"
            />
          </Grid>
          <Grid item xs={6}>
            <ColorPicker
              label="Background Color"
              color={button.backgroundColor}
              onPick={updateButton('backgroundColor')}
              aria-label="background color"
            />
          </Grid>
          <Grid item xs={6}>
            <ColorPicker
              label="Text Color"
              color={button.textColor}
              onPick={updateButton('textColor')}
              aria-label="text color color"
            />
          </Grid>
          <Grid item xs={6}>
            <ColorPicker
              label="Border  Color"
              color={button.borderColor}
              onPick={updateButton('borderColor')}
              aria-label="border color"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={button.borderRadius || ''}
              label="Border Radius"
              type="number"
              fullWidth
              inputProps={{
                min: MIN_BORDER_RADIUS,
                max: MAX_BORDER_RADIUS,
              }}
              onChange={onChangeNumberHandler(updateButton('borderRadius'))}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Border Thickness</InputLabel>
            <Slider
              min={MIN_BORDER_WIDTH}
              max={MAX_BORDER_WIDTH}
              step={1}
              onChange={handleChangeSlider(updateButton('borderWidth'))}
              valueLabelDisplay="auto"
              value={button.borderWidth ? button.borderWidth : 0}
              aria-label="border thickness"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={button.padding || ''}
              label="Padding"
              type="number"
              fullWidth
              onChange={onChangeNumberHandler(updateButton('padding'))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={button.fontSize || ''}
              label="Font Size"
              type="number"
              fullWidth
              onChange={onChangeNumberHandler(updateButton('fontSize'))}
            />
          </Grid>
        </Grid>
        <InfusionsoftTagInput
          value={button.infusionsoftTag}
          onChange={updateButton('infusionsoftTag')}
        />
      </Box>
      <Box mb={2}>
        <Button
          color="primary"
          variant="outlined"
          onClick={props.onClose}
          fullWidth
        >
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
