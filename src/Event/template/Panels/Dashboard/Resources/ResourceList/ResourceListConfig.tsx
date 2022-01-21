import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'
import {ResourceListSettings} from 'Event/template/Panels/Dashboard/Resources/ResourceList'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function ResourceListConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const template = usePanelsTemplate()
  const updateTemplate = usePanelsUpdate()
  const {resourceList: list} = template
  const {register, control, handleSubmit} = useForm()

  const submit = (
    data: Pick<
      ResourceListSettings,
      | 'isVisible'
      | 'title'
      | 'menuTitle'
      | 'cardBackgroundColor'
      | 'cardBackgroundOpacity'
      | 'color'
      | 'linkColor'
    >,
  ) => {
    updateTemplate({
      resourceList: data,
    })

    props.onClose()
  }

  return (
    <ComponentConfig
      isVisible={props.isVisible}
      onClose={props.onClose}
      title="Resources"
    >
      <form onSubmit={handleSubmit(submit)}>
        <FormControl>
          <Controller
            name="isVisible"
            control={control}
            defaultValue={list.isVisible}
            render={({value, onChange}) => (
              <Switch
                checked={value}
                onChange={onChangeCheckedHandler(onChange)}
                arial-label="toggle resources"
                labelPlacement="end"
                color="primary"
                label="Enabled"
              />
            )}
          />
        </FormControl>
        <TextField
          defaultValue={list.title}
          name="title"
          label="Title"
          inputProps={{
            'aria-label': 'update resources title',
            ref: register({required: 'Title is required'}),
          }}
          fullWidth
        />
        <TextField
          defaultValue={list.menuTitle}
          name="menuTitle"
          label="Menu Title"
          inputProps={{
            'aria-label': 'update resources menu field',
            ref: register({required: 'Menu title is required'}),
          }}
          fullWidth
        />
        <Controller
          name="color"
          control={control}
          defaultValue={list.color}
          rules={{
            required: 'Text color is required',
          }}
          render={({value, onChange}) => (
            <ColorPicker
              label="Text Color"
              color={value}
              onPick={onChange}
              aria-label="resource card color"
            />
          )}
        />
        <Controller
          name="linkColor"
          control={control}
          defaultValue={list.linkColor}
          rules={{
            required: 'Link color is required',
          }}
          render={({value, onChange}) => (
            <ColorPicker
              label="Link Color"
              color={value}
              onPick={onChange}
              aria-label="resource card link color"
            />
          )}
        />

        <Controller
          name="cardBackgroundColor"
          control={control}
          defaultValue={list.cardBackgroundColor}
          rules={{
            required: 'Card background color is required',
          }}
          render={({value, onChange}) => (
            <ColorPicker
              label="Card Background Color"
              color={value}
              onPick={onChange}
              aria-label="resource card background color"
            />
          )}
        />

        <InputLabel>Card Background Opacity</InputLabel>
        <Controller
          name="cardBackgroundOpacity"
          control={control}
          defaultValue={list.cardBackgroundOpacity}
          rules={{
            required: 'Card background opacity is required',
          }}
          render={({value, onChange}) => (
            <Slider
              min={0}
              max={100}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
            />
          )}
        />
        <SaveButton />
      </form>
    </ComponentConfig>
  )
}
