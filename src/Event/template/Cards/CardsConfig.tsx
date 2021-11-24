import {onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onUnknownChangeHandler} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import Box from '@material-ui/core/Box'
import Switch from 'lib/ui/form/Switch'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import {Controller, useForm} from 'react-hook-form'

const MIN_LOGO_SIZE = 1
const MAX_LOGO_SIZE = 100

type ConfigFormData = Pick<Cards, 'backgroundPosition' | 'menu' | 'header'>

export function CardsConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const {menu, header, backgroundPosition} = useCardsTemplate()
  const update = useCardsUpdate()
  const {event} = useEvent()
  const {handleSubmit, control} = useForm()

  const save = (data: ConfigFormData) => {
    update(data)
    onClose()
  }

  return (
    <ComponentConfig isVisible={isVisible} onClose={onClose} title="Cards">
      <form onSubmit={handleSubmit(save)}>
        <Box mb={2}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <EventImageUpload
                  label="Logo"
                  property="logo"
                  current={event.logo}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="header.isCollapsed"
                defaultValue={header.isCollapsed}
                control={control}
                render={({value, onChange}) => (
                  <Switch
                    checked={value}
                    onChange={onChangeCheckedHandler(onChange)}
                    arial-label="config header background image visible switch"
                    labelPlacement="start"
                    color="primary"
                    label="Hide Header"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <InputLabel>Logo Size</InputLabel>

        <Controller
          name="header.logoSize"
          defaultValue={header.logoSize}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={MIN_LOGO_SIZE}
              max={MAX_LOGO_SIZE}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="header logo size"
            />
          )}
        />
        <Controller
          name="header.backgroundColor"
          defaultValue={header.backgroundColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Header Background Color"
              color={value}
              onPick={onChange}
              aria-label="header background color"
            />
          )}
        />

        <InputLabel>Header Background Opacity</InputLabel>
        <Controller
          name="header.backgroundOpacity"
          defaultValue={header.backgroundOpacity}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={0}
              max={1}
              step={0.1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              valueLabelFormat={() => <div>{value * 100}</div>}
              value={value || 0}
              aria-label="background opacity"
            />
          )}
        />

        <InputLabel>Background Position</InputLabel>
        <Controller
          name="backgroundPosition"
          defaultValue={backgroundPosition}
          control={control}
          render={({value, onChange}) => (
            <Select
              value={value}
              onChange={onUnknownChangeHandler(onChange)}
              fullWidth
            >
              <MenuItem value="fixed">Fixed</MenuItem>
              <MenuItem value="bottom">Bottom</MenuItem>
            </Select>
          )}
        />
        <Controller
          name="menu.backgroundColor"
          defaultValue={menu.backgroundColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Menu Background Color"
              color={value}
              onPick={onChange}
              aria-label="menu background color"
            />
          )}
        />
        <Controller
          name="menu.textColor"
          defaultValue={menu.textColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Menu Text Color"
              color={value}
              onPick={onChange}
              aria-label="menu text color"
            />
          )}
        />
        <Controller
          name="menu.iconColor"
          defaultValue={menu.iconColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Menu Icon Color"
              color={value}
              onPick={onChange}
              aria-label="menu icon color"
            />
          )}
        />
        <SaveButton />
      </form>
    </ComponentConfig>
  )
}
