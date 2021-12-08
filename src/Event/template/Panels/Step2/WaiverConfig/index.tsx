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
import {Panels, usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'
import {useDispatch} from 'react-redux'
import {waiverLogoPath} from 'Event/Step2/WaiverProvider'
import {fetchFile} from 'lib/http-client'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import TextEditor from 'lib/ui/form/TextEditor'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Grid from '@material-ui/core/Grid'

import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import Box from '@material-ui/core/Box'
import {
  DEFAULT_AGREE_STATEMENT,
  DEFAULT_SIGNATURE_PROMPT,
} from 'Event/Step2/WaiverProvider'

import TemplateFields, {
  DEFAULT_WAIVER_CONFIG_PROPS,
  PanelsWaiverTemplateProps,
  WaiverTemplatePropSetter,
} from 'Event/template/Panels/Step2/WaiverConfig/TemplateFields'
import Preview from 'organization/Event/WaiverConfig/Preview'
import Step2 from 'Event/template/Panels/Step2'
import {fieldError} from 'lib/form'
import {ValidationError} from 'lib/ui/api-client'

const imageUploadId = 'waived-logo-upload'

type WaiverData = {
  title: string
  body: string
  agree_statement: string
  signature_prompt: string
}

export default function WaiverConfig() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors: formErrors,
    control,
  } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [logo, setLogo] = useState<null | File>(null)
  const {
    waiverConfig,
    set: setTemplateProp,
    updateTemplate,
  } = useTemplateWaiverProps()
  const body = watch('body')
  const agree_statement = watch('agree_statement')
  const signature_prompt = watch('signature_prompt')
  const title = watch('title')
  const setWaiver = useSetWaiver()
  const dispatch = useDispatch()
  const {event} = useEvent()
  const [
    responseError,
    setResponseError,
  ] = useState<ValidationError<WaiverData> | null>(null)

  const error = (key: keyof WaiverData) =>
    fieldError(key, {
      form: formErrors,
      response: responseError,
    })

  const errors = {
    title: error('title'),
    body: error('body'),
    signature_prompt: error('signature_prompt'),
    agree_statement: error('agree_statement'),
  }

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
    setValue(
      'agree_statement',
      event.waiver.agree_statement || DEFAULT_AGREE_STATEMENT,
    )
    setValue(
      'signature_prompt',
      event.waiver.signature_prompt || DEFAULT_SIGNATURE_PROMPT,
    )

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
        setResponseError(null)
        dispatch(setEvent(event))
      })
      .then((event) => {
        updateTemplate({waiver: waiverConfig})
      })
      .catch((e) => {
        setResponseError(e)
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
            defaultValue={title}
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
          <TextField
            name="agree_statement"
            label="Agree Statement"
            defaultValue={agree_statement || DEFAULT_AGREE_STATEMENT}
            required
            fullWidth
            inputProps={{
              ref: register({
                required: 'Agree Statement is required',
              }),
              'aria-label': 'waiver agree statement',
            }}
            disabled={submitting}
            rows={4}
            multiline
            error={!!errors.agree_statement}
            helperText={errors.agree_statement}
          />
          <TextField
            name="signature_prompt"
            label="Signature Prompt"
            defaultValue={signature_prompt || DEFAULT_SIGNATURE_PROMPT}
            fullWidth
            inputProps={{
              ref: register,
              'aria-label': 'waiver signature prompt',
            }}
            disabled={submitting}
            error={!!errors.signature_prompt}
            helperText={errors.signature_prompt}
          />

          <Error>{responseError?.message}</Error>

          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TemplateFields
                waiver={waiverConfig}
                set={setTemplateProp}
                submitting={submitting}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid item xs={12} md={12}>
                <Preview
                  body={watch('body')}
                  title={watch('title')}
                  logo={logo?.name || ''}
                  agreeStatement={watch('agree_statement')}
                  signaturePrompt={watch('signature_prompt')}
                >
                  <Step2 />
                </Preview>
              </Grid>
            </Grid>
          </Grid>
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

function BodyError(props: {error?: string}) {
  if (!props.error) {
    return null
  }

  return <FormHelperText error>{props.error}</FormHelperText>
}

function useTemplateWaiverProps() {
  const updateTemplate = usePanelsUpdate()

  const [waiverConfig, setWaiverConfig] = useState<PanelsWaiverTemplateProps>(
    DEFAULT_WAIVER_CONFIG_PROPS,
  )

  const {waiver} = usePanelsTemplate()

  useEffect(() => {
    if (!waiver) {
      return
    }
    const fetchedTechCheck = waiver as Panels['waiver']
    setWaiverConfig(fetchedTechCheck || DEFAULT_WAIVER_CONFIG_PROPS)
  }, [waiver])

  const set: WaiverTemplatePropSetter = (key) => (value) => {
    const updated = {
      ...waiver,
      [key]: value,
    }

    setWaiverConfig(updated)
  }

  return {waiverConfig, set, updateTemplate}
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

function Error(props: {children?: string}) {
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
