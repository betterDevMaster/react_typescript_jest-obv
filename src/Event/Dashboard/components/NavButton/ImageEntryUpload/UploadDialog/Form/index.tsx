import React, {useState} from 'react'
import styled from 'styled-components'
import {useForm} from 'react-hook-form'
import CircularProgress from '@material-ui/core/CircularProgress'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import ButtonBase from 'lib/ui/Button'
import {useTemplate} from 'Event/TemplateProvider'
import {useAttendeeVariables} from 'Event'
import UploadDropzone from 'Event/Dashboard/components/NavButton/ImageEntryUpload/UploadDialog/Form/UploadDropzone'

export default function UploadImageForm(props: {onClose: () => void}) {
  const [image, setImage] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {handleSubmit} = useForm()
  const {client} = useEvent()

  const template = useTemplate()
  const {imageWaterfall: formSettings} = template

  const handleDropFile = (acceptedFile: File) => {
    setImage(acceptedFile)
  }

  const createFormData = () => {
    if (image) {
      const formData = new FormData()
      formData.set('image', image)
      return formData
    }

    return null
  }

  const submit = () => {
    const formData = createFormData()
    if (!formData) {
      return
    }

    setSubmitting(true)
    const url = api(`/image_entries`)
    client
      .post(url, formData)
      .then(() => {
        setSubmitting(false)
        props.onClose()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <ImageContainer>
        <Image image={image} />
        <UploadDropzone onDrop={handleDropFile} />
        <LoadingOverlay visible={submitting} />
      </ImageContainer>
      <UploadButton
        disabled={submitting || !image}
        text={formSettings.uploadButtonText}
        backgroundColor={formSettings.uploadButtonBackgroundColor}
        textColor={formSettings.uploadButtonTextColor}
        borderColor={formSettings.uploadButtonBorderColor}
        borderRadius={formSettings.uploadButtonBorderRadius}
        fontSize={formSettings.uploadButtonFontSize}
      />
    </form>
  )
}

function Image(props: {image: File | null}) {
  if (!props.image) {
    return null
  }

  const src = URL.createObjectURL(props.image)

  return <StyledImage src={src} alt="waterfall image" />
}

function LoadingOverlay(props: {visible: boolean}) {
  if (!props.visible) {
    return null
  }

  return (
    <LoaderWrapper>
      <CircularProgress />
    </LoaderWrapper>
  )
}

function UploadButton(props: {
  backgroundColor: string
  textColor: string
  borderRadius: number
  borderColor: string
  fontSize: number
  text: string
  disabled?: boolean
  onClick?: () => void
}) {
  const v = useAttendeeVariables()

  return (
    <StyledButton
      disabled={props.disabled}
      fullWidth
      textTransform="uppercase"
      backgroundColor={props.backgroundColor}
      textColor={props.textColor}
      borderRadius={props.borderRadius}
      borderColor={props.borderColor}
      onClick={props.onClick}
      fontSize={props.fontSize}
      aria-label="upload image"
      type="submit"
    >
      {v(props.text)}
    </StyledButton>
  )
}

const ImageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const StyledImage = styled.img`
  width: 200px;
`

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledButton = styled(ButtonBase)`
  font-size: 29px;
  font-weight: 700;
  padding: 15px 30px;

  &:hover {
    opacity: 0.8;
  }
`
