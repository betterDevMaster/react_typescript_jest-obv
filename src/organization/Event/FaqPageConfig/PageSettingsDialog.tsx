import React, {useState} from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {Controller, useForm} from 'react-hook-form'
import {useEvent} from 'Event/EventProvider'
import {ObvioEvent} from 'Event'
import Button from '@material-ui/core/Button'
import {useTemplate} from 'Event/TemplateProvider'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  DEFAULT_BACK_TO_DASHBOARD_TEXT,
  DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
} from 'Event/template/SimpleBlog/FaqPage/FaqList/Card'
import ColorPicker from 'lib/ui/ColorPicker'
import {SimpleBlog} from 'Event/template/SimpleBlog'

type FAQPageSettings = NonNullable<SimpleBlog['faq']>

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {event, set: updateEvent} = useEvent()
  const {handleSubmit, register, control} = useForm()
  const [processing, setProcessing] = useState(false)
  const template = useTemplate()
  const {client} = useOrganization()

  const {faq: pageSettings} = template

  const data = ({
    title,
    description,
    backToDashboardText,
    backToDashboardTextColor,
  }: FAQPageSettings) => {
    const required = {
      template: {
        ...template,
        faq: {
          title,
          description,
          backToDashboardText,
          backToDashboardTextColor,
        },
      },
    }
    return required
  }

  const submit = (form: FAQPageSettings) => {
    if (processing) {
      return
    }

    setProcessing(true)
    const url = api(`/events/${event.slug}`)
    client
      .put<ObvioEvent>(url, data(form))
      .then((event) => {
        updateEvent(event)
        setProcessing(false)
        props.onClose()
      })
      .catch(() => {
        setProcessing(false)
      })
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Faq Page</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(submit)}>
            <TextField
              label="Title"
              name="title"
              defaultValue={pageSettings?.title || DEFAULT_TITLE}
              variant="outlined"
              fullWidth
              inputProps={{'aria-label': 'faq page title', ref: register}}
              disabled={processing}
            />
            <Controller
              name="description"
              defaultValue={pageSettings?.description || DEFAULT_DESCRIPTION}
              control={control}
              render={({onChange, value}) => (
                <TextEditorContainer>
                  <TextEditor data={value} onChange={onChange} />
                </TextEditorContainer>
              )}
            />
            <TextField
              defaultValue={
                pageSettings?.backToDashboardText ||
                DEFAULT_BACK_TO_DASHBOARD_TEXT
              }
              name="backToDashboardText"
              label="Back to Dashboard Text"
              fullWidth
              inputProps={{
                ref: register,
                'aria-label': 'back to dashboard text',
              }}
            />
            <Grid item xs={12}>
              <Controller
                name="backToDashboardTextColor"
                defaultValue={
                  pageSettings?.backToDashboardTextColor ||
                  DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR
                }
                control={control}
                render={({onChange, value}) => (
                  <ColorPicker
                    label="Back to Dashboard Text Color"
                    color={value}
                    onPick={onChange}
                    aria-label="text color"
                  />
                )}
              />
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={processing}
              aria-label="save"
            >
              Save
            </Button>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}
