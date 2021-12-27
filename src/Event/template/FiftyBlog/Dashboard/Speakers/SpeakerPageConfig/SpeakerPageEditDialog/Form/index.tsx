import React, {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Slider,
  TextField,
} from '@material-ui/core'

import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'

import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import ColorPicker from 'lib/ui/ColorPicker'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'

const MIN_SPACE_SIZE = 0
const MAX_SPACE_SIZE = 10

// type UpdateFormData = {
//   title: string
//   description: string
//   backToDashboardText: string
//   backToDashboardTextColor: string
//   speakerImageSize: number
//   speakersSpace: number
//   menuTitle?: string
//   isVisible?: boolean
//   titleFontSize?: number
//   titleColor?: string
//   descriptionFontSize?: number
//   descriptionColor?: string
//   titleDescFontSize?: number
//   titleDescColor?: string
// }

export default function SpeakerPageConfigForm(props: {onClose: () => void}) {
  const {register, handleSubmit, control} = useForm()
  const [submitting, setSubmitting] = useState(false)

  const template = useFiftyBlogTemplate()
  const {speakers: speakerPageSettings} = template
  const update = useFiftyBlogUpdate()

  const submit = (data: Partial<FiftyBlog['speakers']>) => {
    setSubmitting(true)

    update({
      speakers: data,
    })

    props.onClose()
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormControl>
        <Controller
          name="isVisible"
          control={control}
          defaultValue={speakerPageSettings.isVisible}
          render={({value, onChange}) => (
            <Switch
              checked={value}
              onChange={onChangeCheckedHandler(onChange)}
              arial-label="toggle speakers"
              labelPlacement="end"
              color="primary"
              label="Enabled"
            />
          )}
        />
      </FormControl>
      <TextField
        name="title"
        label="Speaker Page Title"
        defaultValue={speakerPageSettings.title}
        required
        fullWidth
        inputProps={{
          ref: register({required: 'Speaker Page title is required.'}),
          'aria-label': 'edit speaker page title',
        }}
      />
      <TextField
        name="menuTitle"
        label="Speaker Page Menu Title"
        defaultValue={speakerPageSettings.menuTitle}
        required
        fullWidth
        inputProps={{
          ref: register({required: 'Speaker Page Meny Title is required.'}),
          'aria-label': 'edit speaker page menu title',
        }}
      />
      <Controller
        name="description"
        defaultValue={speakerPageSettings.description}
        control={control}
        render={({onChange, value}) => (
          <TextEditorContainer>
            <TextEditor data={value} onChange={onChange} />
          </TextEditorContainer>
        )}
      />
      <Box display="flex" flexDirection="row" flex="2">
        <Box flex="1">
          <Controller
            name="titleColor"
            defaultValue={speakerPageSettings.titleColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Title Color"
                color={value}
                onPick={onChange}
                aria-label="title color"
              />
            )}
          />
        </Box>
        <Box flex="1">
          <TextField
            name="titleFontSize"
            defaultValue={speakerPageSettings.titleFontSize}
            label="Title Font Size"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              ref: register,
            }}
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" flex="2">
        <Box flex="1">
          <Controller
            name="titleDescColor"
            defaultValue={speakerPageSettings.titleDescColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Title Description Color"
                color={value}
                onPick={onChange}
                aria-label="title description color"
              />
            )}
          />
        </Box>
        <Box flex="1">
          <TextField
            name="titleDescFontSize"
            defaultValue={speakerPageSettings.titleDescFontSize}
            label="Title Description Font Size"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              ref: register,
            }}
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" flex="2">
        <Box flex="1">
          <Controller
            name="descriptionColor"
            defaultValue={speakerPageSettings.descriptionColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Description Color"
                color={value}
                onPick={onChange}
                aria-label="description color"
              />
            )}
          />
        </Box>
        <Box flex="1">
          <TextField
            name="descriptionFontSize"
            defaultValue={speakerPageSettings.descriptionFontSize}
            label="Description Font Size"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              ref: register,
            }}
          />
        </Box>
      </Box>
      <Grid item xs={12}>
        <InputLabel>Speaker Image Size</InputLabel>
        <Controller
          name="speakerImageSize"
          defaultValue={speakerPageSettings.speakerImageSize}
          control={control}
          render={({onChange, value}) => (
            <Slider
              min={1}
              max={11}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <InputLabel>Space Between Speakers</InputLabel>
        <Controller
          name="speakersSpace"
          defaultValue={speakerPageSettings.speakersSpace}
          control={control}
          render={({onChange, value}) => (
            <Slider
              min={MIN_SPACE_SIZE}
              max={MAX_SPACE_SIZE}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
            />
          )}
        />
      </Grid>
      <SaveButton
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        aria-label="save speaker page config"
        disabled={submitting}
      >
        SAVE
      </SaveButton>
    </form>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
