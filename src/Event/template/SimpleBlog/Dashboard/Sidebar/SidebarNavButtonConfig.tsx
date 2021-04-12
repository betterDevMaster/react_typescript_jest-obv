import TextField from '@material-ui/core/TextField'
import NavButton from 'Event/Dashboard/components/NavButton'
import {
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import React from 'react'
import Box from '@material-ui/core/Box'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {SIDEBAR_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import Switch from 'lib/ui/form/Switch'
import Grid from '@material-ui/core/Grid'
import InfusionsoftTagInput from 'Event/Dashboard/components/NavButton/InfusionsoftTagInput'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TargetConfig from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig/TargetConfig'

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 25

export type SidebarNavButtonConfig = {
  type: typeof SIDEBAR_NAV_BUTTON
  id: string
}

export function SidebarNavButtonConfig(props: {
  id: SidebarNavButtonConfig['id']
}) {
  const {sidebarNav: buttons} = useTemplate()

  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()
  const {id} = props

  if (!id) {
    throw new Error('Missing component id')
  }

  const button = buttons.entities[id]

  const update = (updated: NavButton) => {
    updateTemplate({
      sidebarNav: {
        ...buttons,
        entities: {
          ...buttons.entities,
          [id]: updated,
        },
      },
    })
  }

  const removeButton = () => {
    const {[id]: target, ...otherButtons} = buttons.entities
    const updatedIds = buttons.ids.filter((i) => i !== id)

    closeConfig()
    updateTemplate({
      sidebarNav: {
        entities: otherButtons,
        ids: updatedIds,
      },
    })
  }

  const updateButton = <T extends keyof NavButton>(key: T) => (
    value: NavButton[T],
  ) =>
    update({
      ...button,
      [key]: value,
    })

  return (
    <>
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
      <TargetConfig update={updateButton} button={button} />
      <Grid container spacing={2}>
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
            value={button.borderWidth ? button.borderWidth : 1}
            aria-label="border thickness"
          />
        </Grid>
      </Grid>

      <InfusionsoftTagInput
        button={button}
        onChange={updateButton('infusionsoftTag')}
      />
      <Box mt={2} mb={3}>
        <DangerButton
          fullWidth
          variant="outlined"
          aria-label="remove button"
          onClick={removeButton}
        >
          REMOVE BUTTON
        </DangerButton>
      </Box>
    </>
  )
}
