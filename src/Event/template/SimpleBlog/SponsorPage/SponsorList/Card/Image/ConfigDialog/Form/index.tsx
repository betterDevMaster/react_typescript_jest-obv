import styled from 'styled-components'
import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import {fetchFile} from 'lib/http-client'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import UploadedImage from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card/Image/ConfigDialog/Form/UploadedImage'
import {ValidationError} from 'lib/api-client'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {useSponsors} from 'organization/Event/SponsorsProvider'

const imageUploadId = 'sponsor-image-upload'

export default function EditSponsorForm(props: {
  sponsor: Sponsor
  onDone: () => void
}) {
  const {handleSubmit} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [image, setImage] = useState<null | File>(null)
  const {sponsor} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const {update: updateSponsor} = useSponsors()

  useEffect(() => {
    if (sponsor.image) {
      fetchFile(sponsor.image.name, sponsor.image.url)
        .then(setImage)
        .catch(() => {
          // ignore invalid image
        })
    }
  }, [sponsor])

  const clearError = () => setServerError(null)

  const data = () => {
    if (image) {
      let formData = new FormData()
      formData.set('image', image)
      return formData
    }

    return {
      image: null,
    }
  }

  const contentType = image ? 'multipart/form-data' : 'application/json'

  const submit = () => {
    setSubmitting(true)

    const url = api(`/sponsors/${sponsor.id}`)

    client
      .put<Sponsor>(url, data(), {
        headers: {
          'content-type': contentType,
        },
      })
      .then((sponsor) => {
        updateSponsor(sponsor)
        props.onDone()
      })
      .catch((e) => {
        setServerError(e)
        setSubmitting(false)
      })
  }

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    if (file) {
      setImage(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }
  return (
    <>
      <ErrorAlert onClose={clearError}>{serverError?.message}</ErrorAlert>
      <form onSubmit={handleSubmit(submit)}>
        <ImageContainer>
          <UploadButton variant="outlined" color="primary">
            <UploadButtonLabel htmlFor={imageUploadId}>
              Upload Logo
            </UploadButtonLabel>
          </UploadButton>
          <input
            id={imageUploadId}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            hidden
            aria-label="sponsor image input"
          />
          <UploadedImage image={image} onRemove={removeImage} />
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

const UploadButton = withStyles({
  root: {
    padding: 0,
  },
})(Button)

const UploadButtonLabel = styled.label`
  padding: 5px 15px;
  cursor: pointer;
`

const ImageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
