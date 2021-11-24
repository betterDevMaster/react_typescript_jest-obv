import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import FormControl from '@material-ui/core/FormControl'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import ColorPicker from 'lib/ui/ColorPicker'
import InputLabel from '@material-ui/core/InputLabel'
import styled from 'styled-components'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import {Cards} from 'Event/template/Cards'
import {useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import Switch from 'lib/ui/form/Switch'

export default function CardsImageWaterfallConfig(props: {
  onClose: () => void
}) {
  const template = useCardsTemplate()
  const {imageWaterfall: current} = template
  const {control, handleSubmit, register} = useForm()

  const updateTemplate = useCardsUpdate()

  const submit = (data: Cards['imageWaterfall']) => {
    updateTemplate({
      imageWaterfall: {
        ...data,
      },
    })

    props.onClose()
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <FormControl>
          <Controller
            name="isVisible"
            control={control}
            defaultValue={current.isVisible}
            render={({value, onChange}) => (
              <Switch
                checked={value}
                onChange={onChangeCheckedHandler(onChange)}
                arial-label="toggle image waterfall page"
                labelPlacement="end"
                color="primary"
                label="Enabled"
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <Controller
            name="title"
            control={control}
            defaultValue={current.title}
            render={({value, onChange}) => (
              <TextField
                label="Title"
                value={value}
                onChange={onChange}
                inputProps={{'aria-label': 'title'}}
              />
            )}
          />
        </FormControl>
        <TextField
          name="menuTitle"
          label="Image Waterfall Page Menu Title"
          defaultValue={current.menuTitle}
          required
          fullWidth
          inputProps={{
            ref: register({
              required: 'Image Waterfall Page Menu Title is required.',
            }),
            'aria-label': 'edit image waterfall page menu title',
          }}
        />
        <FormControl fullWidth>
          <Controller
            name="description"
            defaultValue={current.description}
            control={control}
            render={({onChange, value}) => (
              <TextEditorContainer>
                <TextEditor data={value} onChange={onChange} />
              </TextEditorContainer>
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            name="uploadFormTitle"
            control={control}
            defaultValue={current.uploadFormTitle}
            render={({value, onChange}) => (
              <TextField
                label="Upload Form Title"
                value={value}
                onChange={onChange}
                inputProps={{'aria-label': 'uploadFormTitle'}}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            name="uploadFormDescription"
            control={control}
            defaultValue={current.uploadFormDescription}
            render={({onChange, value}) => (
              <TextEditorContainer>
                <TextEditor data={value} onChange={onChange} />
              </TextEditorContainer>
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            name="uploadButtonText"
            control={control}
            defaultValue={current.uploadButtonText}
            render={({value, onChange}) => (
              <TextField
                label="Upload Button Text"
                value={value}
                onChange={onChange}
                inputProps={{'aria-label': 'uploadButtonText'}}
              />
            )}
          />
        </FormControl>

        <StyledInputLabel>Upload Button Font Size</StyledInputLabel>
        <FormControl fullWidth>
          <Controller
            name="uploadButtonFontSize"
            control={control}
            defaultValue={current.uploadButtonFontSize}
            render={({value, onChange}) => (
              <Slider
                valueLabelDisplay="auto"
                aria-label="uploadButtonFontSize"
                value={value ? value : 20}
                onChange={handleChangeSlider(onChange)}
                step={1}
                min={5}
                max={50}
              />
            )}
          />
        </FormControl>

        <StyledInputLabel>Upload Button Border Radius</StyledInputLabel>
        <FormControl fullWidth>
          <Controller
            name="uploadButtonBorderRadius"
            control={control}
            defaultValue={current.uploadButtonBorderRadius}
            render={({value, onChange}) => (
              <Slider
                valueLabelDisplay="auto"
                aria-label="uploadButtonBorderRadius"
                value={value}
                onChange={handleChangeSlider(onChange)}
                step={1}
                min={0}
                max={60}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            name="uploadButtonTextColor"
            control={control}
            defaultValue={current.uploadButtonTextColor}
            render={({value, onChange}) => (
              <ColorPicker
                label="Upload Button Text Color"
                color={value}
                onPick={onChange}
                aria-label="uploadButtonTextColor"
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            name="uploadButtonBackgroundColor"
            control={control}
            defaultValue={current.uploadButtonBackgroundColor}
            render={({value, onChange}) => (
              <ColorPicker
                label="Upload Button Background Color"
                color={value}
                onPick={onChange}
                aria-label="uploadButtonBackgroundColor"
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            name="uploadButtonBorderColor"
            control={control}
            defaultValue={current.uploadButtonBorderColor}
            render={({value, onChange}) => (
              <ColorPicker
                label="Upload Button Border Color"
                color={value}
                onPick={onChange}
                aria-label="uploadButtonBorderColor"
              />
            )}
          />
        </FormControl>
        <Controller
          name="actionId"
          defaultValue={current.actionId}
          control={control}
          render={({value, onChange}) => (
            <ActionSelect
              value={value}
              onChange={onChange}
              label="Approved Action"
            />
          )}
        />
        <SaveButton />
      </form>
    </>
  )
}

const StyledInputLabel = styled(InputLabel)`
  font-size: 13px;
`
