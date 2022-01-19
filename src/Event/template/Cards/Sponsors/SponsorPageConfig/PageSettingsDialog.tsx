import React, {useState} from 'react'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import {Controller, useForm} from 'react-hook-form'
import {useEvent} from 'Event/EventProvider'
import {ObvioEvent} from 'Event'
import Button from '@material-ui/core/Button'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import TextField from '@material-ui/core/TextField'
import {fieldError} from 'lib/form'
import {ValidationError} from 'lib/ui/api-client'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import DangerButton from 'lib/ui/Button/DangerButton'
import ColorPicker from 'lib/ui/ColorPicker'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import Switch from 'lib/ui/form/Switch'
import FormControl from '@material-ui/core/FormControl'

const MIN_PER_ROW = 1
const MAX_PER_ROW = 3
const MAX_FILE_SIZE_BYTES = 5000000 // 5MB
const imageUploadId = `sponsor-question-icon-upload`

type SettingsFormData = {
  perRow: number
  title: string
  menuTitle: string
  cardBackgroundColor?: string
  cardBackgroundOpacity?: number
  description?: string
  isVisible?: boolean
}

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {event, set: updateEvent} = useEvent()
  const {handleSubmit, control, errors, register} = useForm()
  const [processing, setProcessing] = useState(false)
  const template = useCardsTemplate()
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const [image, setImage] = useState<null | File>(null)
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false)
  const updateTemplate = useCardsUpdate()

  const imageData = () => {
    if (image) {
      const formData = new FormData()
      formData.set('sponsor_question_icon', image)
      return formData
    }

    if (shouldRemoveImage) {
      return {
        sponsor_question_icon: null,
      }
    }

    return null
  }

  const submit = (form: SettingsFormData) => {
    if (processing) {
      return
    }

    setProcessing(true)
    const url = api(`/events/${event.slug}`)

    const eventData = imageData()

    updateTemplate({
      sponsors: form,
    })

    if (!eventData) {
      setProcessing(false)
      props.onClose()
      return
    }

    client
      .put<ObvioEvent>(url, eventData)
      .then((event) => {
        updateEvent(event)
        setProcessing(false)
        props.onClose()
      })
      .catch((error) => {
        setServerError(error)
        setProcessing(false)
      })
  }

  const handleQuestionIconSelect = (image: File) => {
    setImage(image)
    setShouldRemoveImage(false)
  }

  const handleRemoveImage = () => {
    setShouldRemoveImage(true)
    setImage(null)
  }

  const allowQuestionIconUpload = () => {
    if (shouldRemoveImage) {
      return true
    }

    return !event.sponsor_question_icon && !image
  }

  const titleError = fieldError('title', {form: errors, response: serverError})

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Sponsor Page</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(submit)}>
            <FormControl>
              <Controller
                name="isVisible"
                control={control}
                defaultValue={template.sponsors.isVisible}
                render={({value, onChange}) => (
                  <Switch
                    checked={value}
                    onChange={onChangeCheckedHandler(onChange)}
                    arial-label="toggle sponsors"
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
              label="Sponsors Page Title"
              defaultValue={template.sponsors?.title}
              required
              fullWidth
              inputProps={{
                ref: register({required: 'Sponsors Page title is required.'}),
                'aria-label': 'edit sponsors page title',
              }}
              helperText={titleError}
            />
            <TextField
              name="menuTitle"
              label="Sponsors Page Menu Title"
              defaultValue={template.sponsors?.menuTitle}
              required
              fullWidth
              inputProps={{
                ref: register({
                  required: 'Sponsors Page Menu Title is required.',
                }),
                'aria-label': 'edit sponsors page menu title',
              }}
            />
            <Controller
              name="description"
              defaultValue={template.sponsors.description}
              control={control}
              render={({onChange, value}) => (
                <TextEditorContainer>
                  <TextEditor data={value} onChange={onChange} />
                </TextEditorContainer>
              )}
            />

            <InputLabel>Sponsors Per Row</InputLabel>
            <Controller
              name="perRow"
              defaultValue={template.sponsors.perRow}
              control={control}
              render={({onChange, value}) => (
                <Slider
                  min={MIN_PER_ROW}
                  max={MAX_PER_ROW}
                  step={1}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  value={value}
                />
              )}
            />

            <Controller
              name="cardBackgroundColor"
              defaultValue={template.sponsors.cardBackgroundColor}
              control={control}
              render={({onChange, value}) => (
                <ColorPicker
                  label="Container Background Color"
                  color={value}
                  onPick={onChange}
                  aria-label="container background color"
                />
              )}
            />

            <InputLabel>Container Background Opacity</InputLabel>
            <Controller
              name="cardBackgroundOpacity"
              defaultValue={template.sponsors.cardBackgroundOpacity}
              control={control}
              render={({onChange, value}) => (
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
            <Box mb={2}>
              <Label>Question Icon</Label>
              <QuestionIcon selected={image} isVisible={!shouldRemoveImage} />
              <QuestionIconUploadButton
                onSelect={handleQuestionIconSelect}
                selected={image}
                isVisible={allowQuestionIconUpload()}
                disabled={processing}
              />
              <RemoveQuestionIconButton
                selected={image}
                isVisible={!shouldRemoveImage}
                onClick={handleRemoveImage}
                disabled={processing}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={processing}
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

function QuestionIcon(props: {selected: File | null; isVisible: boolean}) {
  const {event} = useEvent()
  const {selected} = props

  if (!props.isVisible) {
    return null
  }

  if (selected) {
    const src = URL.createObjectURL(selected)
    return (
      <QuestionIconBox>
        <img src={src} alt="Selected sponsor question icon" />
      </QuestionIconBox>
    )
  }

  if (!event.sponsor_question_icon) {
    return null
  }

  return (
    <QuestionIconBox>
      <img
        src={event.sponsor_question_icon.url}
        alt={event.sponsor_question_icon.name}
      />
    </QuestionIconBox>
  )
}

function QuestionIconUploadButton(props: {
  onSelect: (image: File) => void
  selected: null | File
  isVisible: boolean
  disabled: boolean
}) {
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image too large. Please select an image smaller than 5MB.')
      return
    }

    if (!file) {
      return
    }

    props.onSelect(file)
  }

  if (!props.isVisible) {
    return null
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        aria-label="select image to upload"
        disabled={props.disabled}
      >
        <UploadButtonLabel htmlFor={imageUploadId}>Upload</UploadButtonLabel>
      </Button>
      <input
        id={imageUploadId}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        value="" // Required to allow uploading multiple times
        hidden
        aria-label="question icon input"
      />
      <Error>{error}</Error>
    </>
  )
}

function RemoveQuestionIconButton(props: {
  onClick: () => void
  isVisible: boolean
  selected: File | null
  disabled: boolean
}) {
  const {event} = useEvent()

  const hasImage =
    Boolean(props.selected) || Boolean(event.sponsor_question_icon)

  if (!hasImage || !props.isVisible) {
    return null
  }

  return (
    <DangerButton
      variant="outlined"
      aria-label="remove sponsor question icon"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      Remove
    </DangerButton>
  )
}

const QuestionIconBox = styled.div`
  width: 200px;
  margin: ${(props) => props.theme.spacing[3]} 0;

  img {
    width: 100%;
    max-height: 100%;
  }
`

const Label = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)

const UploadButtonLabel = styled.label`
  cursor: pointer;
`

export function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}
