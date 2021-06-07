import React, {useState} from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import {Controller, useForm} from 'react-hook-form'
import {useEvent} from 'Event/EventProvider'
import {ObvioEvent} from 'Event'
import Button from '@material-ui/core/Button'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {usePanels} from 'Event/template/Panels'
import {DEFAULT_COLUMN_SIZE} from 'Event/template/Panels/Dashboard/Sponsors/SponsorList'

const MIN_COLUMN_SIZE = 2
const MAX_COLUMN_SIZE = 4

type SettingsFormData = {
  columnSize: number
}

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {event, set: updateEvent} = useEvent()
  const {handleSubmit, control} = useForm()
  const [processing, setProcessing] = useState(false)
  const {template} = usePanels()
  const {client} = useOrganization()

  const data = ({columnSize}: SettingsFormData) => {
    const required = {
      template: {
        ...template,
        sponsors: {
          columnSize,
        },
      },
    }

    return required
  }

  const submit = (form: SettingsFormData) => {
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
      <DialogTitle>Sponsor Page</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(submit)}>
            <InputLabel>Sponsor Column Size</InputLabel>
            <Controller
              name="columnSize"
              defaultValue={
                template.sponsors?.columnSize || DEFAULT_COLUMN_SIZE
              }
              control={control}
              render={({onChange, value}) => (
                <Slider
                  min={MIN_COLUMN_SIZE}
                  max={MAX_COLUMN_SIZE}
                  step={1}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  value={value}
                />
              )}
            />
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
