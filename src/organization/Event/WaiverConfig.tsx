import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import InputLabel from '@material-ui/core/InputLabel'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import React, {useEffect, useRef, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import FormHelperText from '@material-ui/core/FormHelperText'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {ObvioEvent} from 'Event'
import {setEvent} from 'Event/state/actions'
import {useDispatch} from 'react-redux'
import {waiverLogoPath} from 'Event/Step2/WaiverProvider'
import {fetchFile} from 'lib/http-client'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import TextEditor from 'lib/ui/form/TextEditor'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import Box from '@material-ui/core/Box'

const imageUploadId = 'waived-logo-upload'

type WaiverData = {
  title: string
  body: string
}

export default function WaiverConfig() {
  const {register, handleSubmit, watch, setValue, errors, control} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [logo, setLogo] = useState<null | File>(null)
  const body = watch('body')
  const [responseError, setResponseError] = useState('')
  const setWaiver = useSetWaiver()
  const dispatch = useDispatch()
  const {event} = useEvent()

  // Prevent updating unmounted component
  const mounted = useRef(true)
  // Manual loading state required to trigger CKEditor load
  // on browser 'back', or else the body would not be
  // set.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mounted.current) {
      return
    }

    if (!event.waiver) {
      setLoading(false)
      return
    }

    setValue('title', event.waiver.title)
    setValue('body', event.waiver.body)

    const logoPath = event.waiver.logo
    if (logoPath) {
      fetchFile(logoPath, waiverLogoPath(logoPath))
        .then(setLogo)
        .catch(() => {
          // ignore invalid image
        })
    }

    setLoading(false)
    return () => {
      mounted.current = false
    }
  }, [event, setValue])

  const submit = (data: WaiverData) => {
    setSubmitting(true)
    setWaiver(data, logo)
      .then((event) => {
        dispatch(setEvent(event))
      })
      .catch((e) => {
        setResponseError(e.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    setLogo(file)
  }

  const removeLogo = () => {
    setLogo(null)
  }

  return (
    <Layout>
      <Page>
        <form onSubmit={handleSubmit(submit)}>
          <FormControl fullWidth disabled={submitting}>
            <FormControlLabel
              control={
                <Controller
                  type="checkbox"
                  name="is_enabled"
                  defaultValue={event.waiver ? event.waiver.is_enabled : true}
                  control={control}
                  render={({onChange, value}) => (
                    <Switch
                      checked={!!value}
                      onChange={(e) => onChange(e.target.checked)}
                      inputProps={{'aria-label': 'toggle enabled'}}
                    />
                  )}
                />
              }
              label="Enable"
            />
          </FormControl>
          <TextField
            name="title"
            label="Waiver File Title (optional)"
            fullWidth
            inputProps={{ref: register, 'aria-label': 'waiver title'}}
            disabled={submitting}
            helperText="Defaults to the event name"
          />
          <Box mb={2}>
            <LogoLabel>Logo (optional)</LogoLabel>
            <UploadButton variant="outlined" color="primary">
              <UploadButtonLabel htmlFor={imageUploadId}>
                Upload Image
              </UploadButtonLabel>
            </UploadButton>
            <input
              id={imageUploadId}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              hidden
              aria-label="logo input"
            />
            <UploadedLogo logo={logo} remove={removeLogo} />
          </Box>
          <FormControl fullWidth>
            <InputLabel>Form</InputLabel>
            <Controller
              name="form_id"
              control={control}
              defaultValue={event.waiver?.form?.id || ''}
              render={({onChange, value}) => (
                <FormSelect onChange={onChange} value={value} />
              )}
            />
          </FormControl>
          <Editor>
            <input
              type="hidden"
              name="body"
              aria-label="waiver body"
              ref={register({required: 'Body is required.'})}
            />
            <BodyLabel required error={!!errors.body}>
              Body
            </BodyLabel>
            {loading ? null : (
              <TextEditor
                data={body}
                onChange={(value) => setValue('body', value)}
              />
            )}

            <BodyError error={errors.body} />
          </Editor>
          <Error>{responseError}</Error>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            aria-label="save waiver"
          >
            Save
          </Button>
        </form>
      </Page>
    </Layout>
  )
}

function UploadedLogo(props: {logo: File | null; remove: () => void}) {
  if (!props.logo) {
    return null
  }

  const data = URL.createObjectURL(props.logo)
  return (
    <ImagePreview>
      <img src={data} alt={props.logo.name}></img>
      <Button onClick={props.remove} variant="outlined" size="small">
        clear
      </Button>
    </ImagePreview>
  )
}

function BodyError(props: {error?: {message: string}}) {
  if (!props.error) {
    return null
  }

  return <FormHelperText error>{props.error.message}</FormHelperText>
}

function useSetWaiver() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/waiver`)

  return (data: WaiverData, logo: File | null) => {
    const formData = new FormData()

    for (const [key, val] of Object.entries(data)) {
      if (val === null || val === undefined) {
        /**
         * FormData sends everything as strings, so we'll have to explicitly
         * skip sending values on null, ie. un-setting a form_id.
         */
        continue
      }

      formData.set(key, val)
    }

    if (logo) {
      formData.set('logo', logo)
    }

    return client.post<ObvioEvent>(url, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  }
}

const LogoLabel = withStyles({
  root: {
    display: 'block',
    marginBottom: spacing[3],
  },
})(InputLabel)

const UploadButton = withStyles({
  root: {
    padding: 0,
  },
})(Button)

const UploadButtonLabel = styled.label`
  padding: 5px 15px;
  cursor: pointer;
`

const BodyLabel = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)

const Editor = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[6]};

  .ck-editor__editable_inline {
    min-height: 300px;
    max-height: 600px;
  }
`

function Error(props: {children: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

const ImagePreview = styled.div`
  width: 200px;
  margin-top: ${(props) => props.theme.spacing[3]};

  img {
    width: 100%;
    max-height: 100%;
  }
`
