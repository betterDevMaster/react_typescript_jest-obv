import styled from 'styled-components'
import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import {ValidationError} from 'lib/api-client'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {useSponsors} from 'organization/Event/SponsorsProvider'
import {useFileSelect} from 'lib/ui/form/file'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import Label from 'lib/ui/form/ImageUpload/Label'
import ImageUpload from 'lib/ui/form/ImageUpload'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Image from 'lib/ui/form/ImageUpload/Image'

export default function EditSponsorForm(props: {
  sponsor: Sponsor
  onDone: () => void
}) {
  const {handleSubmit} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {sponsor} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const {update: updateSponsor} = useSponsors()

  const image = useFileSelect(sponsor.image)

  const clearError = () => setServerError(null)

  const data = () => {
    if (image.selected) {
      let formData = new FormData()
      formData.set('image', image.selected)
      return formData
    }

    if (image.wasRemoved) {
      return {
        image: null,
      }
    }

    return {}
  }

  const submit = () => {
    const hasUpdate = Boolean(image.selected) || image.wasRemoved
    if (!hasUpdate) {
      props.onDone()
      return
    }

    setSubmitting(true)

    const url = api(`/sponsors/${sponsor.id}`)

    client
      .put<Sponsor>(url, data())
      .then((sponsor) => {
        updateSponsor(sponsor)
        props.onDone()
      })
      .catch((e) => {
        setServerError(e)
        setSubmitting(false)
      })
  }

  return (
    <>
      <ErrorAlert onClose={clearError}>{serverError?.message}</ErrorAlert>
      <form onSubmit={handleSubmit(submit)}>
        <ImageContainer>
          <ImageUpload file={image} disabled={submitting}>
            <Cropper width={300} height={100} canResize />
            <Label>Logo</Label>
            <Image alt="favicon" width={100} />
            <UploadButton
              inputProps={{
                'aria-label': 'sponsor image input',
              }}
            />
            <RemoveImageButton aria-label="remove sponsor image" />
          </ImageUpload>
        </ImageContainer>
        <SaveButton
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          aria-label="save sponsor"
          disabled={submitting}
        >
          SAVE
        </SaveButton>
      </form>
    </>
  )
}

const ImageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
