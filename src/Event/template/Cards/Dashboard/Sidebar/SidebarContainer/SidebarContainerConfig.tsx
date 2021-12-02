import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {
  handleChangeSlider,
  onChangeCheckedHandler,
  onUnknownChangeHandler,
} from 'lib/dom'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'

const MIN_SIDEBAR_PADDING_TOP = 0
const MAX_SIDEBAR_PADDING_TOP = 720

const MIN_SIDEBAR_BORDER_WIDTH = 0
const MAX_SIDEBAR_BORDER_WIDTH = 50

const MIN_SIDEBAR_BORDER_RADIUS = 0
const MAX_SIDEBAR_BORDER_RADIUS = 25

const MIN_SIDEBAR_HEAD_BORDER_RADIUS = 0
const MAX_SIDEBAR_HEAD_BORDER_RADIUS = 25

export function SidebarContainerConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props

  const {sidebar} = useCardsTemplate()
  const update = useCardsUpdate()

  const {event} = useEvent()

  const {control, handleSubmit} = useForm()

  const save = (data: Cards['sidebar']) => {
    update({
      sidebar: data,
    })
    onClose()
  }

  return (
    <ComponentConfig isVisible={isVisible} onClose={onClose} title="Sidebar">
      <form onSubmit={handleSubmit(save)}>
        <Box display="flex" justifyContent="flex-end">
          <Controller
            name="isVisible"
            defaultValue={sidebar.isVisible || false}
            control={control}
            render={({value, onChange}) => (
              <Switch
                checked={value}
                onChange={onChangeCheckedHandler(onChange)}
                arial-label="config visible switch"
                labelPlacement="start"
                color="primary"
                label={value ? 'Enabled' : 'Disabled'}
              />
            )}
          />
        </Box>
        <EventImageUpload
          label="Background Image"
          property="sidebar_background"
          current={event.sidebar_background}
        />
        <InputLabel>Top Padding</InputLabel>
        <Controller
          name="paddingTop"
          defaultValue={sidebar.paddingTop || 48}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={MIN_SIDEBAR_PADDING_TOP}
              max={MAX_SIDEBAR_PADDING_TOP}
              step={4}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="padding top"
            />
          )}
        />

        <Controller
          name="separatorColor"
          defaultValue={sidebar.separatorColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Separator Color"
              color={value}
              onPick={onChange}
              aria-label="separator color"
            />
          )}
        />

        <InputLabel>Separator Thickness</InputLabel>
        <Controller
          name="separatorThickness"
          defaultValue={sidebar.separatorThickness}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={1}
              max={10}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="separator width"
            />
          )}
        />

        <FormControl fullWidth>
          <InputLabel>Separator Style</InputLabel>
          <Controller
            name="separatorStyle"
            defaultValue={sidebar.separatorStyle}
            control={control}
            render={({value, onChange}) => (
              <Select
                value={value}
                onChange={onUnknownChangeHandler(onChange)}
                label="Separator Style"
              >
                <MenuItem value="solid">Solid</MenuItem>
                <MenuItem value="dashed">Dashed</MenuItem>
                <MenuItem value="dotted">Dotted</MenuItem>
              </Select>
            )}
          />
        </FormControl>
        <Controller
          name="background"
          defaultValue={sidebar.background}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Background Color"
              color={value}
              onPick={onChange}
              aria-label="background color"
            />
          )}
        />
        <Controller
          name="textColor"
          defaultValue={sidebar.textColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Text Color"
              color={value}
              onPick={onChange}
              aria-label="color"
            />
          )}
        />

        <Controller
          name="headTextColor"
          defaultValue={sidebar.headTextColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Head Text Color"
              color={value}
              onPick={onChange}
              aria-label="head text color"
            />
          )}
        />

        <Controller
          name="headBackgroundColor"
          defaultValue={sidebar.headBackgroundColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Head Background Color"
              color={value}
              onPick={onChange}
              aria-label="color"
            />
          )}
        />

        <InputLabel>Head Background Border</InputLabel>

        <Controller
          name="headBackgroundBorder"
          defaultValue={sidebar.headBackgroundBorder}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={MIN_SIDEBAR_HEAD_BORDER_RADIUS}
              max={MAX_SIDEBAR_HEAD_BORDER_RADIUS}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="header background border"
            />
          )}
        />

        <InputLabel>Border Thickness</InputLabel>

        <Controller
          name="borderWidth"
          defaultValue={sidebar.borderWidth}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={MIN_SIDEBAR_BORDER_WIDTH}
              max={MAX_SIDEBAR_BORDER_WIDTH}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="border thickness"
            />
          )}
        />
        <Controller
          name="borderColor"
          defaultValue={sidebar.borderColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker label="Border Color" color={value} onPick={onChange} />
          )}
        />
        <InputLabel>Border Radius</InputLabel>

        <Controller
          name="borderRadius"
          defaultValue={sidebar.borderRadius}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={MIN_SIDEBAR_BORDER_RADIUS}
              max={MAX_SIDEBAR_BORDER_RADIUS}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="border radius"
            />
          )}
        />
        <SaveButton type="submit" />
      </form>
    </ComponentConfig>
  )
}
