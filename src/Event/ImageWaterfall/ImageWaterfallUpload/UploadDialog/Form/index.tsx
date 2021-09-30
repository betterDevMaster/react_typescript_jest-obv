import React, {useState} from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import {useForm} from 'react-hook-form'
import ImageUpload from 'lib/ui/form/ImageUpload'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Image from 'lib/ui/form/ImageUpload/Image'
import {useFileSelect} from 'lib/ui/form/file'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import Label from 'lib/ui/form/ImageUpload/Label'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'

export default function UploadImageForm(props: {onClose: () => void}) {
  const {handleSubmit} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {client} = useEvent()
  const image = useFileSelect(null)

  const createFormData = () => {
    if (image.selected) {
      const formData = new FormData()

      formData.set('image', image.selected)

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
        <ImageUpload file={image} disabled={submitting}>
          <Cropper width={300} height={300} canResize />
          <Label>Image</Label>
          <Image alt="favicon" width={100} />
          <UploadButton
            inputProps={{
              'aria-label': 'image input',
            }}
          />
          <RemoveImageButton aria-label="remove image" />
        </ImageUpload>
      </ImageContainer>
      <SaveButton
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        aria-label="upload image"
        disabled={submitting || !image.selected}
      >
        UPLOAD
      </SaveButton>
    </form>
  )
}

const ImageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
