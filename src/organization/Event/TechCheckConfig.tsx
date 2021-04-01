import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import {useForm, Controller} from 'react-hook-form'
import Layout from 'organization/user/Layout'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {ObvioEvent} from 'Event'
import {useDispatch} from 'react-redux'
import {setEvent} from 'Event/state/actions'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import AreaSelect from 'organization/Event/Area/AreaSelect'
import Page from 'organization/Event/Page'
import TextEditor from 'lib/ui/form/TextEditor'
import TextField from '@material-ui/core/TextField'
import {fieldError} from 'lib/form'
import {ValidationError} from 'lib/api-client'
import {upToMinutes} from 'lib/date-time'

export interface TechCheckData {
  body: string
  start: string
  is_enabled: boolean
}

export default function TechCheckConfig() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors: formErrors,
    control,
  } = useForm()
  const [loading, setLoading] = useState(true)
  const [responseError, setResponseError] = useState<
    ValidationError<TechCheckData>
  >(null)
  const [submitting, setSubmitting] = useState(false)
  const setTechCheck = useSetTechCheck()
  const dispatch = useDispatch()
  const mounted = useRef(true)
  const {event} = useEvent()

  const areaId = watch('area_id')
  const canSave = !submitting && Boolean(areaId)

  const error = (key: keyof TechCheckData) =>
    fieldError(key, {
      form: formErrors,
      response: responseError,
    })

  const errors = {
    body: error('body'),
    start: error('start'),
  }

  const submit = (data: TechCheckData) => {
    setSubmitting(true)
    setTechCheck(data)
      .then((event) => {
        dispatch(setEvent(event))
      })
      .catch((e) => {
        setResponseError(e)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  useEffect(() => {
    if (!mounted.current) {
      return
    }

    if (!event.tech_check) {
      setLoading(false)
      return
    }

    setValue('body', event.tech_check.body)
    setValue('start', upToMinutes(event.tech_check.start))
    setValue('is_enabled', event.tech_check.is_enabled)

    const areaId = event.tech_check.area ? event.tech_check.area.id : null
    setValue('area_id', areaId)

    setLoading(false)
    return () => {
      mounted.current = false
    }
  }, [event, setValue])

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
                  defaultValue={false}
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
            type="datetime-local"
            label="Start"
            name="start"
            required
            fullWidth
            inputProps={{
              ref: register({
                required: 'Start is required',
              }),
              'aria-label': 'tech check start',
            }}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.start}
            helperText={errors.start}
            disabled={submitting}
          />
          <Controller
            control={control}
            name="area_id"
            defaultValue={null}
            render={({onChange, value}) => (
              <AreaSelect value={value} onPick={onChange} required />
            )}
          />
          <Editor>
            <input
              type="hidden"
              name="body"
              aria-label="tech check body"
              ref={register({required: 'Body is required.'})}
            />
            <BodyLabel required error={!!errors.body}>
              Body
            </BodyLabel>
            {loading ? null : (
              <TextEditor
                data={watch('body')}
                onChange={(val) => setValue('body', val)}
              />
            )}

            <BodyError error={errors.body} />
          </Editor>
          <Error>{responseError?.message}</Error>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            aria-label="save tech check"
            disabled={!canSave}
          >
            Save
          </Button>
        </form>
      </Page>
    </Layout>
  )
}

const BodyError = (props: {error?: string}) => {
  if (!props.error) {
    return null
  }

  return <FormHelperText error>{props.error}</FormHelperText>
}

const Error = (props: {children?: string}) => {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const useSetTechCheck = () => {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/tech_check`)

  return (data: TechCheckData) => client.put<ObvioEvent>(url, data)
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

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
