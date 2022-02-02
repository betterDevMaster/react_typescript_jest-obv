import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import {Rule} from 'Event/attendee-rules'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Controller} from 'react-hook-form'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import TextEditor from 'lib/ui/form/TextEditor'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {fetchFile} from 'lib/http-client'
import {waiverLogoPath} from 'Event/Step2/WaiverProvider'
import FormHelperText from '@material-ui/core/FormHelperText'
import {TargetWaiver} from 'organization/Event/WaiverConfig/AdditionalWaivers/ConfigDialog'
import {
  AdditionalWaiver,
  useAdditionalWaivers,
} from 'organization/Event/WaiverConfig/AdditionalWaivers'
import {WaiverConfig} from 'Event'
import {useIfMounted} from 'lib/dom'
import {useValidatedForm} from 'lib/form'
import {useToggle} from 'lib/toggle'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import DangerButton from 'lib/ui/Button/DangerButton'

const imageUploadId = 'waived-logo-upload-update'

type AdditionalWaiverData = Omit<
  WaiverConfig,
  'form' | 'rules' | 'priority'
> & {
  form_id: number | null
}

export default function Form(props: {
  onDone: () => void
  waiver: TargetWaiver
}) {
  const {waiver, onDone} = props
  const [rules, setRules] = useState<Rule[]>([])
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const {event} = useEvent()
  const {client} = useOrganization()
  const {flag: submitting, toggle: toggleSubmitting} = useToggle()
  const [logo, setLogo] = useState<null | File>(null)
  const {
    register,
    handleSubmit,
    watch,
    control,
    errors,
    responseError,
    setResponseError,
  } = useValidatedForm<AdditionalWaiver>()
  const ifMounted = useIfMounted()

  const {
    update: updateWaiver,
    add: addWaiver,
    remove: removeWaiver,
  } = useAdditionalWaivers()

  const canDelete = Boolean(waiver.id)

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    setLogo(file)
  }

  const removeLogo = () => {
    setLogo(null)
  }

  const isEnabled = watch('is_enabled')

  useEffect(() => {
    if (!waiver.rules) {
      return
    }

    setRules(waiver.rules)
  }, [setRules, waiver])

  useEffect(() => {
    const logoPath = waiver.logo

    if (logoPath) {
      fetchFile(logoPath, waiverLogoPath(logoPath))
        .then(ifMounted(setLogo))
        .catch(() => {
          // ignore invalid image
        })
    }
  }, [waiver, setLogo, ifMounted])

  const createFormData = (data: AdditionalWaiverData) => {
    const formData = new FormData()

    for (const [key, val] of Object.entries(data)) {
      // Form data only sends strings, so to send `null` values, we'll
      // need to omit the key. ie. when unsetting a 'form_id'
      if (val === null || val === undefined) {
        continue
      }

      formData.set(key, String(val))
    }

    if (logo) {
      formData.set('logo', logo)
    }

    if (rules.length > 0) {
      formData.set('rules', JSON.stringify(rules))
    }

    return formData
  }

  const update = (id: number, data: FormData) => {
    const url = api(`/additional_waivers/${id}`)
    return client.put<AdditionalWaiver>(url, data)
  }

  const create = (data: FormData) => {
    const url = api(`/events/${event.slug}/additional_waivers`)
    return client.post<AdditionalWaiver>(url, data)
  }

  const sendRequest = (data: FormData) => {
    if (waiver.id) {
      return update(waiver.id, data).then(updateWaiver)
    } else {
      return create(data).then(addWaiver)
    }
  }

  const handleRemove = () => {
    const {id} = waiver
    if (!id) {
      throw new Error('Missing waiver id')
    }

    if (submitting) {
      return
    }

    toggleSubmitting()

    const url = api(`/additional_waivers/${id}`)
    client
      .delete(url)
      .then(() => {
        removeWaiver(id)
        onDone()
      })
      .catch((error) => {
        setResponseError(error)
        toggleSubmitting()
      })
  }

  const submit = (data: AdditionalWaiverData) => {
    if (submitting) {
      return
    }

    toggleSubmitting()
    const formData = createFormData(data)

    sendRequest(formData)
      .then(onDone)
      .catch((error) => {
        setResponseError(error)
        toggleSubmitting()
      })
  }

  return (
    <>
      <RuleConfig
        visible={ruleConfigVisible}
        onChange={setRules}
        rules={rules}
        close={toggleRuleConfig}
        description="Waiver will be shown when"
      >
        <form onSubmit={handleSubmit(submit)}>
          <ConfigureRulesButton onClick={toggleRuleConfig} />

          <FormControl fullWidth disabled={submitting}>
            <FormControlLabel
              control={
                <Controller
                  type="checkbox"
                  name="is_enabled"
                  defaultValue={waiver ? waiver.is_enabled : true}
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
              label={watch('is_enabled') ? 'Enabled' : 'Disabled'}
            />
          </FormControl>
          <TextField
            name="title"
            label="Waiver File Title (optional)"
            defaultValue={waiver.title ? waiver.title : ''}
            fullWidth
            inputProps={{ref: register, 'aria-label': 'waiver title'}}
            disabled={submitting}
            helperText="Defaults to the event name"
          />
          <Box mb={2}>
            <LogoLabel disabled={submitting}>Logo (optional)</LogoLabel>
            <UploadButton
              variant="outlined"
              color="primary"
              disabled={submitting}
            >
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
              defaultValue={waiver.form?.id || ''}
              render={({onChange, value}) => (
                <FormSelect
                  onChange={onChange}
                  value={value}
                  disabled={submitting}
                />
              )}
            />
          </FormControl>
          <Editor>
            <BodyLabel
              required={isEnabled}
              error={Boolean(errors.body)}
              disabled={submitting}
            >
              Body
            </BodyLabel>
            <Controller
              name="body"
              required={watch('is_enabled')}
              defaultValue={waiver.body}
              control={control}
              render={({onChange, value}) => (
                <TextEditor
                  data={value}
                  onChange={onChange}
                  disabled={submitting}
                />
              )}
              rules={{
                required: isEnabled ? 'Body is required' : false,
              }}
            />
            <BodyError error={errors.body} />
          </Editor>
          <TextField
            name="agree_statement"
            label="Agree Statement"
            defaultValue={waiver.agree_statement || ''}
            required={watch('is_enabled')}
            fullWidth
            inputProps={{
              ref: register,
              'aria-label': 'waiver agree statement',
            }}
            disabled={submitting}
            rows={4}
            multiline
          />
          <TextField
            name="signature_prompt"
            label="Signature Prompt"
            defaultValue={waiver.signature_prompt || ''}
            required={watch('is_enabled')}
            fullWidth
            inputProps={{
              ref: register,
              'aria-label': 'waiver signature prompt',
            }}
            disabled={submitting}
          />

          <SaveButton
            variant="contained"
            color="primary"
            fullWidth
            disabled={submitting}
            type="submit"
            aria-label="save additional waiver"
          >
            Save
          </SaveButton>
          <RemoveButton
            showing={canDelete}
            onClick={handleRemove}
            disabled={submitting}
          />
          <ErrorAlert>{responseError?.message}</ErrorAlert>
        </form>
      </RuleConfig>
    </>
  )
}

const SaveButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[2]}!important;
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const StyledDangerButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

function BodyError(props: {error?: string}) {
  if (!props.error) {
    return null
  }

  return <FormHelperText error>{props.error}</FormHelperText>
}

function RemoveButton(props: {
  showing: boolean
  onClick: () => void
  disabled?: boolean
}) {
  if (!props.showing) {
    return null
  }

  return (
    <StyledDangerButton
      fullWidth
      variant="outlined"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      Remove
    </StyledDangerButton>
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

const ImagePreview = styled.div`
  width: 200px;
  margin-top: ${(props) => props.theme.spacing[3]};

  img {
    width: 100%;
    max-height: 100%;
  }
`
