import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
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

export interface TechCheckData {
  body: string
  is_enabled: boolean
}

export default function TechCheckConfig() {
  const {register, handleSubmit, watch, setValue, errors, control} = useForm()
  const [loading, setLoading] = useState(true)
  const [responseError, setResponseError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const setTechCheck = useSetTechCheck()
  const dispatch = useDispatch()
  const mounted = useRef(true)
  const {event} = useEvent()

  const areaId = watch('area_id')
  const canSave = !submitting && Boolean(areaId)

  const setBody = (_: any, editor: any) => {
    setValue('body', editor.getData())
  }

  const submit = (data: TechCheckData) => {
    setSubmitting(true)
    setTechCheck(data)
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

  useEffect(() => {
    if (!mounted.current) {
      return
    }

    if (!event.tech_check) {
      setLoading(false)
      return
    }

    setValue('body', event.tech_check.body)
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
              <CKEditor
                editor={ClassicEditor}
                data={watch('body')}
                onChange={setBody}
                config={{
                  toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'blockQuote',
                    'link',
                    'numberedList',
                    'bulletedList',
                    'insertTable',
                  ],
                }}
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

const BodyError = (props: {error?: {message: string}}) => {
  if (!props.error) {
    return null
  }

  return <FormHelperText error>{props.error.message}</FormHelperText>
}

const Error = (props: {children: string}) => {
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
