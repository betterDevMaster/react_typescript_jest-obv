import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {useDispatchUpdate, useTemplate} from 'Event/TemplateProvider'
import {Controller, useForm} from 'react-hook-form'
import {Template} from 'Event/template'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import ColorPicker from 'lib/ui/ColorPicker'
import InputLabel from '@material-ui/core/InputLabel'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'

export default function ImageWaterfallConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const template = useTemplate()
  const {imageWaterfall: current} = template
  const {control, handleSubmit} = useForm()

  const updateTemplate = useDispatchUpdate()

  const submit = (data: Template['imageWaterfall']) => {
    updateTemplate({
      imageWaterfall: {
        ...current,
        ...data,
      },
    })
    props.onClose()
  }

  return (
    <Dialog open={props.isVisible} onClose={props.onClose}>
      <DialogTitle>Image Entries Modal Config</DialogTitle>
      <DialogContent>
        <Box mb={3}>
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
                control={control}
                defaultValue={current.description}
                render={({value, onChange}) => (
                  <TextField
                    label="Description"
                    value={value}
                    onChange={onChange}
                    inputProps={{'aria-label': 'description'}}
                  />
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
            <Button
              fullWidth
              color="primary"
              type="submit"
              variant="contained"
              aria-label="save"
            >
              Save
            </Button>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

const StyledInputLabel = styled(InputLabel)`
  font-size: 13px;
`
