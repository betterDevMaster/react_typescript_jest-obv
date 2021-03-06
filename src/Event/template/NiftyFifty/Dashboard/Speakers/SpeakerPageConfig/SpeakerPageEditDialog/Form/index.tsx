import React, {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'

import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'

import {
  NiftyFifty,
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'

import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import ColorPicker from 'lib/ui/ColorPicker'
import Button from 'lib/ui/Button'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {numberFormat} from 'lib/numberFormat'

const MIN_SPACE_SIZE = 0
const MAX_SPACE_SIZE = 10

export default function SpeakerPageConfigForm(props: {onClose: () => void}) {
  const {register, handleSubmit, control} = useForm()
  const [submitting, setSubmitting] = useState(false)

  const template = useNiftyFiftyTemplate()
  const {speakers: speakerPageSettings} = template
  const update = useNiftyFiftyUpdate()

  const submit = (data: Partial<NiftyFifty['speakers']>) => {
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
      <Grid item xs={12}>
        <InputLabel>Image Size</InputLabel>
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
      <Grid container>
        <Grid item xs={12} md={6}>
          <Controller
            name="evenBackgroundColor"
            defaultValue={speakerPageSettings.evenBackgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Even Background Color"
                color={value || '#FFFFFF'}
                onPick={onChange}
                aria-label="evenbackground color"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Even Background Opacity</InputLabel>
          <Controller
            name="evenBackgroundOpacity"
            defaultValue={speakerPageSettings.evenBackgroundOpacity}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={0}
                max={1}
                step={0.1}
                valueLabelFormat={(num) => numberFormat(num, 10)}
                onChange={handleChangeSlider(onChange)}
                valueLabelDisplay="auto"
                value={value}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Controller
            name="oddBackgroundColor"
            defaultValue={speakerPageSettings.oddBackgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Odd Background Color"
                color={value || '#FFFFFF'}
                onPick={onChange}
                aria-label="oddbackground color"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Odd Background Opacity</InputLabel>
          <Controller
            name="oddBackgroundOpacity"
            defaultValue={speakerPageSettings.oddBackgroundOpacity}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={0}
                max={1}
                step={0.1}
                valueLabelFormat={(num) => numberFormat(num, 10)}
                onChange={handleChangeSlider(onChange)}
                valueLabelDisplay="auto"
                value={value}
              />
            )}
          />
        </Grid>
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
