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
import {ValidationError} from 'lib/ui/api-client'
import {now} from 'lib/date-time'
import TemplateFields from 'Event/template/Cards/Step3/TechCheckConfig/TemplateFields'
import {TechCheckPreview} from 'organization/Event/TechCheckConfig/TechCheckPreview'
import Box from '@material-ui/core/Box'
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import TechCheck from 'Event/template/Cards/Step3/TechCheck'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import SkipTechCheckRulesConfig from 'Event/template/SimpleBlog/Step3/TechCheckConfig/SkipTechCheckRulesConfig'

/**
 * Default props to use for techCheck. These will be set when an
 * event does not contain a techCheck config.
 */

const DEFAULT_TECH_CHECK_PROPS: NonNullable<Cards['techCheck']> = {
  buttonText: '',
  buttonBackground: colors.primary,
  buttonTextColor: '#FFFFFF',
  buttonBorderColor: colors.primary,
  buttonBorderRadius: 4,
  buttonBorderWidth: 0,
  buttonWidth: 12,
  hasCustomButtons: false,
}

export type CardsTechCheckTemplateProps = NonNullable<Cards['techCheck']>

type TechCheckTemplatePropSetter = <
  K extends keyof CardsTechCheckTemplateProps
>(
  key: K,
) => (value: CardsTechCheckTemplateProps[K]) => void

export interface TechCheckData {
  body: string
  start: string
  is_enabled: boolean
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
  const template = useCardsTemplate()
  const updateTemplate = useCardsUpdate()
  const {techCheck, set: setTemplateProp} = useTemplateTechCheckProps()
  const {event} = useEvent()
  const [rules, setRules] = useState(template.skipTechCheckRules)

  const areaKey = watch('area_key')
  const enabled = watch('is_enabled') || event.tech_check?.is_enabled
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

    updateTemplate({
      techCheck,
      skipTechCheckRules: rules,
    })

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
    setValue('start', event.tech_check.start)
    setValue('is_enabled', event.tech_check.is_enabled)
    setValue('area_key', event.tech_check.area_key)
    setValue('additional_content', event.tech_check.additional_content)

    setLoading(false)
    return () => {
      mounted.current = false
    }
  }, [event, setValue])

  return (
    <SkipTechCheckRulesConfig rules={rules} onChange={setRules}>
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
                    onChange={(e) => {
                      onChange(e.target.checked)
                    }}
                    inputProps={{'aria-label': 'toggle enabled'}}
                  />
                )}
              />
            }
            label={enabled ? 'Enabled' : 'Disabled'}
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
            <LocalizedDateTimePicker
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
        <TemplateFields
          techCheck={techCheck}
          set={setTemplateProp}
          submitting={submitting}
        />
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Editor>
                <input
                  type="hidden"
                  name="additional_content"
                  aria-label="tech check content"
                  ref={register}
                />
                <BodyLabel>Additional Content</BodyLabel>
                {loading ? null : (
                  <TextEditor
                    data={watch('additional_content')}
                    onChange={(val) => setValue('additional_content', val)}
                  />
                )}
              </Editor>
            </Grid>
            <Grid item xs={12} md={6}>
              <PreviewBodyLabel>Preview</PreviewBodyLabel>
              <TechCheckPreview
                body={watch('body')}
                content={watch('additional_content')}
                render={(props) => (
                  <TechCheck {...props} settings={techCheck} />
                )}
              />
            </Grid>
          </Grid>
        </Box>
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
    </SkipTechCheckRulesConfig>
  )
}

function useTemplateTechCheckProps() {
  const [techCheck, setTechCheck] = useState<CardsTechCheckTemplateProps>(
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
