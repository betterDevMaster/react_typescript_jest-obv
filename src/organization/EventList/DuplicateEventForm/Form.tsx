import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import styled from 'styled-components'
import {spacing} from 'lib/ui/theme'
import React from 'react'
import {Controller, UseFormMethods} from 'react-hook-form'
import {useValidatedForm} from 'lib/form'
import moment from 'moment'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {useOrganization} from 'organization/OrganizationProvider'
import {useToggle} from 'lib/toggle'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {ObvioEvent} from 'Event'
import {slugHelperText} from 'organization/EventList/CreateEventForm/Form'
import Center from 'lib/ui/layout/Center'
import spinner from 'assets/images/obvio_spinner_80.gif'
import Box from '@material-ui/core/Box'

export interface DuplicateEventData {
  name: string
  slug: string
  start: string
  end: string
  num_expected_attendees: number
  copy_areas: boolean
  copy_rooms: boolean
}

export default function Form(props: {
  onComplete: (event: ObvioEvent) => void
  onCancel: () => void
}) {
  const {
    register,
    errors,
    handleSubmit,
    control,
    responseError,
    setResponseError,
    watch,
  } = useValidatedForm()

  const duplicateEvent = useDuplicateEvent()
  const {flag: submitting, toggle: toggleSubmitting} = useToggle()

  const submit = (data: DuplicateEventData) => {
    if (submitting) {
      return
    }

    toggleSubmitting()

    duplicateEvent(data)
      .then(props.onComplete)
      .catch((error) => {
        setResponseError(error)
        toggleSubmitting()
      })
  }

  const hasDuplicateAreas = watch('copy_areas')
  const inThreeDays = moment().add(3, 'days').toISOString()
  const inSixDays = moment().add(6, 'days').toISOString()
  const slug = watch('slug')

  if (submitting) {
    return <Loader />
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <TextField
        label="Event Name"
        name="name"
        required
        fullWidth
        inputProps={{
          ref: register({
            required: 'Name is required',
          }),
          'aria-label': 'event name',
        }}
        error={!!errors.name}
        helperText={errors.name}
        disabled={submitting}
      />
      <TextField
        label="Unique Slug"
        name="slug"
        required
        fullWidth
        inputProps={{
          ref: register({
            required: 'Slug is required',
          }),
          'aria-label': 'domain slug',
        }}
        error={!!errors.slug}
        disabled={submitting}
        helperText={slugHelperText(errors, slug)}
      />
      <Controller
        name="start"
        control={control}
        defaultValue={inThreeDays}
        rules={{
          required: 'Start is required',
        }}
        render={({onChange, value}) => (
          <LocalizedDateTimePicker
            disabled={submitting}
            value={value}
            onChange={(date) => onChange(date?.toISOString() || '')}
            fullWidth
            label="Start"
            inputProps={{
              'aria-label': 'start',
              onChange,
            }}
          />
        )}
      />
      <Controller
        name="end"
        control={control}
        defaultValue={inSixDays}
        rules={{
          required: 'End is required',
        }}
        render={({onChange, value}) => (
          <LocalizedDateTimePicker
            disabled={submitting}
            value={value}
            onChange={(date) => onChange(date?.toISOString() || '')}
            fullWidth
            label="End"
            inputProps={{
              'aria-label': 'end',
              onChange,
            }}
          />
        )}
      />
      <TextField
        required
        label="Expected Number of Attendees"
        type="number"
        name="num_expected_attendees"
        fullWidth
        inputProps={{
          ref: register({
            required: 'Expected Number of Attendees is required',
          }),
          'aria-label': 'expected number of attendees',
        }}
        error={!!errors.numAttendees}
        helperText={errors.numAttendees}
        disabled={submitting}
      />
      <FormControl fullWidth disabled={submitting}>
        <FormControlLabel
          control={
            <Controller
              type="checkbox"
              control={control}
              name="copy_areas"
              defaultValue={false}
              render={({onChange, value}) => (
                <Switch
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  inputProps={{'aria-label': 'toggle duplicate areas'}}
                />
              )}
            />
          }
          label="Duplicate Areas"
        />
      </FormControl>
      <CopyRoomsSwitch
        showing={hasDuplicateAreas}
        submitting={submitting}
        control={control}
      />
      <Error>{responseError && responseError.message}</Error>
      <ActionButton
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
        size="large"
        disabled={submitting}
        aria-label="submit"
      >
        Duplicate Event
      </ActionButton>
      <ActionButton
        variant="outlined"
        fullWidth
        color="primary"
        size="large"
        onClick={props.onCancel}
        disabled={submitting}
      >
        Cancel
      </ActionButton>
    </form>
  )
}

function CopyRoomsSwitch(props: {
  showing: boolean
  control: UseFormMethods['control']
  submitting: boolean
}) {
  const {showing, control, submitting} = props
  if (!showing) {
    return null
  }

  return (
    <FormControl fullWidth disabled={submitting}>
      <FormControlLabel
        control={
          <Controller
            type="checkbox"
            control={control}
            name="copy_rooms"
            defaultValue={false}
            render={({onChange, value}) => (
              <Switch
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                inputProps={{'aria-label': 'toggle duplicate rooms'}}
              />
            )}
          />
        }
        label="Duplicate Rooms"
      />
    </FormControl>
  )
}

function Error(props: {children: string | null}) {
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

const ActionButton = styled(Button)`
  margin: ${(props) => props.theme.spacing[2]};
`

function useDuplicateEvent() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/duplicate`)

  return (data: DuplicateEventData) => client.post<ObvioEvent>(url, data)
}

function Loader() {
  return (
    <StyledCenter>
      <Container>
        <Spinner src={spinner} alt="loading" />
        <Box mb={1}>
          <Typography variant="h5" align="center">
            One moment, just creating a copy of everything.
          </Typography>
        </Box>
        <Typography align="center">
          We'll automatically redirect you once this is complete.
        </Typography>
      </Container>
    </StyledCenter>
  )
}

const StyledCenter = styled(Center)`
  background: #ffffff;
  z-index: 10000;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Spinner = styled.img`
  width: 64px;
`
