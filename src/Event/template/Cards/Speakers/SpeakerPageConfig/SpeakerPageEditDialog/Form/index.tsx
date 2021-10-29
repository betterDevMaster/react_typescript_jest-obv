import React, {useState} from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import {Controller, useForm} from 'react-hook-form'
import {fieldError} from 'lib/form'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import {ObvioEvent} from 'Event'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {ValidationError} from 'lib/api-client'
import {useCards} from 'Event/template/Cards'
import Switch from 'lib/ui/form/Switch'
import FormControl from '@material-ui/core/FormControl'

const MIN_SPACE_SIZE = 0
const MAX_SPACE_SIZE = 10

type UpdateFormData = {
  description: string
  backToDashboardText: string
  backToDashboardTextColor: string
  speakerImageSize: number
  speakersSpace: number
  menuTitle?: string
  isVisible?: boolean
}

export default function SpeakerPageConfigForm(props: {onClose: () => void}) {
  const {register, handleSubmit, errors, control} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {event, set: setEvent} = useEvent()
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)

  const {template} = useCards()
  const {speakers: speakerPageSettings} = template

  const submit = (data: UpdateFormData) => {
    setSubmitting(true)
    const url = api(`/events/${event.slug}`)
    client
      .put<ObvioEvent>(url, {
        template: {
          ...template,
          speakers: {
            ...data,
            orderedIds: speakerPageSettings.orderedIds,
          },
        },
      })
      .then((event) => {
        setEvent(event)
        setSubmitting(false)
        props.onClose()
      })
      .catch(setServerError)
      .finally(() => {
        setSubmitting(false)
      })
  }

  const titleError = fieldError('title', {form: errors, response: serverError})

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
        error={Boolean(titleError)}
        name="title"
        label="Speaker Page Title"
        defaultValue={speakerPageSettings.title}
        required
        fullWidth
        inputProps={{
          ref: register({required: 'Speaker Page title is required.'}),
          'aria-label': 'edit speaker page title',
        }}
        helperText={titleError}
      />
      <TextField
        name="menuTitle"
        label="Speaker Page Menu Title"
        defaultValue={speakerPageSettings.menuTitle}
        required
        fullWidth
        inputProps={{
          ref: register({required: 'Speaker Page Menu Title is required.'}),
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
