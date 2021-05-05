import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import {colors, spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import {useForm, Controller} from 'react-hook-form'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {ObvioEvent} from 'Event'
import {useDispatch} from 'react-redux'
import {setEvent} from 'Event/state/actions'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import AreaSelect from 'organization/Event/Area/AreaSelect'
import TextEditor from 'lib/ui/form/TextEditor'
import {fieldError} from 'lib/form'
import {ValidationError} from 'lib/api-client'
import {DateTimePicker} from '@material-ui/pickers'
import {useTemplate} from 'Event/TemplateProvider'
import {Template} from 'Event/template'
import {now} from 'lib/date-time'
import TemplateFields from 'organization/Event/TechCheckConfig/Form/TemplateFields'

// import {TechCheckPreview} from 'Event/template/SimpleBlog/TechCheck'
import {TechCheckPreview} from 'organization/Event/TechCheckConfig/TechCheckPreview'

/**
 * Default props to use for techCheck. These will be set when an
 * event does not contain a techCheck config.
 */

const DEFAULT_TECH_CHECK_PROPS: NonNullable<Template['techCheck']> = {
  buttonText: '',
  buttonBackground: colors.primary,
  buttonTextColor: '#FFFFFF',
  buttonBorderColor: colors.primary,
  buttonBorderRadius: 4,
  buttonBorderWidth: 0,
  buttonWidth: 12,
}

export type TechCheckTemplateProps = NonNullable<Template['techCheck']>

type TechCheckTemplatePropSetter = <K extends keyof TechCheckTemplateProps>(
  key: K,
) => (value: TechCheckTemplateProps[K]) => void

export interface TechCheckData {
  body: string
  start: string
  is_enabled: boolean
  template: ObvioEvent['template']
  content: string
}

export default function Form() {
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
  const template = useTemplate()
  const {techCheck, set: setTemplateProp} = useTemplateTechCheckProps()
  const {event} = useEvent()

  const areaKey = watch('area_key')
  const canSave = !submitting && Boolean(areaKey)

  const error = (key: keyof TechCheckData) =>
    fieldError(key, {
      form: formErrors,
      response: responseError,
    })

  const errors = {
    body: error('body'),
    start: error('start'),
  }

  const submit = (data: Omit<TechCheckData, 'template'>) => {
    setSubmitting(true)

    /**
     * Add in template props. Template props are handled outside
     * of react hook forms so we'll mix them in here to be
     * saved together with the template.
     */
    const withTemplate = {
      ...data,
      template: {
        ...template,
        techCheck,
      },
    }

    setTechCheck(withTemplate)
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
    setValue('start', event.tech_check.start)
    setValue('is_enabled', event.tech_check.is_enabled)
    setValue('area_key', event.tech_check.area_key)
    setValue('content', event.tech_check.content)

    setLoading(false)
    return () => {
      mounted.current = false
    }
  }, [event, setValue])

  return (
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
      <Controller
        name="start"
        control={control}
        defaultValue={now()}
        rules={{
          required: 'Start is required',
        }}
        render={({onChange, value}) => (
          <DateTimePicker
            disabled={submitting}
            value={value}
            onChange={(date) => {
              onChange(date?.toISOString() || '')
            }}
            inputProps={{
              'aria-label': 'tech check start',
              onChange,
            }}
            fullWidth
            label="Start"
          />
        )}
      />
      <Controller
        control={control}
        name="area_key"
        defaultValue={event.tech_check?.area_key || ''}
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
        <Editor>
          <input
            type="hidden"
            name="content"
            aria-label="tech check content"
            ref={register}
          />
          <BodyLabel>Content</BodyLabel>
          {loading ? null : (
            <TextEditor
              data={watch('content')}
              onChange={(val) => setValue('content', val)}
            />
          )}
        </Editor>
          <TemplateFields
            techCheck={techCheck}
            set={setTemplateProp}
            submitting={submitting}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PreviewBodyLabel>Preview</PreviewBodyLabel>
          <TechCheckPreview
            body={watch('body')}
            content={watch('content')}
            techCheckTemplate={techCheck}
          />
        </Grid>
      </Grid>
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
  )
}

function useTemplateTechCheckProps() {
  const [techCheck, setTechCheck] = useState<TechCheckTemplateProps>(
    DEFAULT_TECH_CHECK_PROPS,
  )
  const {event} = useEvent()

  useEffect(() => {
    if (!event?.template?.techCheck) {
      return
    }

    setTechCheck(event.template.techCheck)
  }, [event])

  const set: TechCheckTemplatePropSetter = (key) => (value) => {
    const updated = {
      ...techCheck,
      [key]: value,
    }

    setTechCheck(updated)
  }

  return {techCheck, set}
}

function BodyError(props: {error?: string}) {
  if (!props.error) {
    return null
  }

  return <FormHelperText error>{props.error}</FormHelperText>
}

function Error(props: {children?: string}) {
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
const PreviewBodyLabel = styled(BodyLabel)`
  margin-top: ${(props) => props.theme.spacing[4]};
`
