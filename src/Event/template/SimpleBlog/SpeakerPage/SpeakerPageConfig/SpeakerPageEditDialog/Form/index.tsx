import React from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import {Controller, useForm} from 'react-hook-form'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider} from 'lib/dom'
import {
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import {Column} from 'lib/ui/layout'

const MIN_SPACE_SIZE = 0
const MAX_SPACE_SIZE = 10

type UpdateFormData = {
  title: string
  description: string
  backToDashboardText: string
  backToDashboardTextColor: string
  speakerImageSize: Column
  speakersSpace: number
}

export default function SpeakerPageConfigForm(props: {onClose: () => void}) {
  const {register, handleSubmit, control} = useForm()

  const template = useSimpleBlogTemplate()
  const update = useSimpleBlogUpdate()
  const {speakers: speakerPageSettings} = template

  const submit = (data: UpdateFormData) => {
    update({
      speakers: data,
    })

    props.onClose()
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
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
      <TextField
        defaultValue={speakerPageSettings.backToDashboardText}
        name="backToDashboardText"
        label="Back to Dashboard Text"
        fullWidth
        inputProps={{
          ref: register,
          'aria-label': 'back to dashboard text',
        }}
      />
      <Grid item xs={12}>
        <Controller
          name="backToDashboardTextColor"
          defaultValue={speakerPageSettings.backToDashboardTextColor}
          control={control}
          render={({onChange, value}) => (
            <ColorPicker
              label="Back to Dashboard Text Color"
              color={value}
              onPick={onChange}
              aria-label="text color"
            />
          )}
        />
      </Grid>
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
      >
        SAVE
      </SaveButton>
    </form>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
