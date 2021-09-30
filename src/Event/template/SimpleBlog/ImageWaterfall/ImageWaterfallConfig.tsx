import React from 'react'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {Controller, useForm} from 'react-hook-form'
import FormControl from '@material-ui/core/FormControl'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import ColorPicker from 'lib/ui/ColorPicker'
import InputLabel from '@material-ui/core/InputLabel'
import styled from 'styled-components'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'

export default function SimpleBlogImageWaterfallConfig(props: {
  onClose: () => void
}) {
  const {template} = useSimpleBlog()
  const {imageWaterfall: current} = template
  const {control, handleSubmit} = useForm()

  const updateTemplate = useDispatchUpdate()

  const submit = (data: SimpleBlog['imageWaterfall']) => {
    updateTemplate({
      imageWaterfall: {
        ...current,
        ...data,
      },
    })

    props.onClose()
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
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
            name="backToDashboardText"
            control={control}
            defaultValue={current.backToDashboardText}
            render={({value, onChange}) => (
              <TextField
                label="Back To Dashboard Text"
                value={value}
                onChange={onChange}
                inputProps={{'aria-label': 'backToDashboardText'}}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Controller
            name="backToDashboardTextColor"
            control={control}
            defaultValue={current.backToDashboardTextColor}
            render={({value, onChange}) => (
              <ColorPicker
                label="Back To Dashboard Text Color"
                color={value}
                onPick={onChange}
                aria-label="backToDashboardTextColor"
              />
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
            render={({value, onChange}) => (
              <TextField
                label="Upload Form Description"
                value={value}
                onChange={onChange}
                inputProps={{'aria-label': 'uploadFormDescription'}}
              />
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
