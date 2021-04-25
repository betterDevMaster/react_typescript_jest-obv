import React, {useState} from 'react'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import {useForm} from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {ObvioEvent} from 'Event'
import Button from '@material-ui/core/Button'
import {handleChangeSlider} from 'lib/dom'
import {useTemplate} from 'Event/TemplateProvider'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import DangerButton from 'lib/ui/Button/DangerButton'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {DEFAULT_SPONSOR_IMAGE_SIZE} from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card'

const imageUploadId = `sponsor-question-icon-upload`
const MAX_FILE_SIZE_BYTES = 5000000 // 5MB

type SettingsFormData = {
  sponsor_page_title: string
}

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {event, set: updateEvent} = useEvent()
  const {handleSubmit, register} = useForm()
  const [processing, setProcessing] = useState(false)
  const template = useTemplate()
  const [imageSize, setImageSize] = useState(
    template.sponsors?.imageSize || DEFAULT_SPONSOR_IMAGE_SIZE,
  )
  const {client} = useOrganization()
  const [image, setImage] = useState<null | File>(null)
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false)

  const data = ({sponsor_page_title}: SettingsFormData) => {
    const required = {
      sponsor_page_title,
      template: {
        ...template,
        sponsors: {
          imageSize,
        },
      },
    }

    if (image) {
      const formData = new FormData()
      formData.set('sponsor_page_title', sponsor_page_title)
      formData.set('template', JSON.stringify(required.template))
      formData.set('sponsor_question_icon', image)
      return formData
    }

    if (shouldRemoveImage) {
      return {
        ...required,
        sponsor_question_icon: null,
      }
    }

    return required
  }

  const submit = (form: SettingsFormData) => {
    if (processing) {
      return
    }

    setProcessing(true)
    const url = api(`/events/${event.slug}`)
    client
      .put<ObvioEvent>(url, data(form))
      .then((event) => {
        updateEvent(event)
        setProcessing(false)
        props.onClose()
      })
      .catch(() => {
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

  return (
    <Dialog open={visible} onClose={onClose} fullWidth>
      <DialogTitle>Sponsor Page</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(submit)}>
            <TextField
              label="Title"
              name="sponsor_page_title"
              defaultValue={event.sponsor_page_title}
              variant="outlined"
              fullWidth
              inputProps={{'aria-label': 'sponsor page title', ref: register}}
              disabled={processing}
            />
            <InputLabel>Image Size</InputLabel>
            <Slider
              min={1}
              max={11}
              step={1}
              value={imageSize}
              onChange={handleChangeSlider(setImageSize)}
              valueLabelDisplay="auto"
              aria-label="sponsor image size"
              disabled={processing}
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

  if (Boolean(selected)) {
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
