import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {ValidationError} from 'lib/api-client'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import Layout from 'organization/user/Layout'
import {withStyles} from '@material-ui/core'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import {fieldError} from 'lib/form'
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router-dom'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {Room} from 'Event/room'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {onChangeCheckedHandler} from 'lib/dom'
import Switch from '@material-ui/core/Switch'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'
import Page from 'organization/Event/Page'

interface CreateRoomData {
  name: string
  max_num_attendees?: number
}

export default function CreateRoomForm() {
  const {register, errors, handleSubmit} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<
    ValidationError<CreateRoomData>
  >(null)
  const history = useHistory()
  const createRoom = useCreateRoom()
  const areaRoutes = useAreaRoutes()
  const goToBackToArea = () => {
    history.push(areaRoutes.root)
  }
  const [hasMaxNumAttendees, setHasMaxNumAttendees] = useState(false)

  const submit = (all: CreateRoomData) => {
    const {max_num_attendees, ...requiredData} = all

    const data = hasMaxNumAttendees ? all : requiredData

    setSubmitting(true)
    createRoom(data)
      .then(goToBackToArea)
      .catch((e) => {
        setServerError(e)
        setSubmitting(false)
      })
  }

  const nameError = fieldError('name', {form: errors, response: serverError})

  return (
    <Layout>
      <Page>
        <Title variant="h5" align="center">
          Create Room
        </Title>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="Room Name"
            name="name"
            required
            fullWidth
            variant="outlined"
            inputProps={{
              ref: register({
                required: 'Name is required',
              }),
              'aria-label': 'room name input',
            }}
            error={Boolean(nameError)}
            helperText={nameError}
          />
          <FormControl required component="fieldset" fullWidth>
            <FormControlLabel
              control={
                <Switch
                  checked={hasMaxNumAttendees}
                  onChange={onChangeCheckedHandler(setHasMaxNumAttendees)}
                  color="primary"
                  inputProps={{
                    'aria-label': 'toggle has max num attendees',
                  }}
                />
              }
              label="Limit maximum number of attendees in room?"
            />
          </FormControl>

          <TextField
            label="Maximum number of attendees"
            type="number"
            name="max_num_attendees"
            fullWidth
            variant="outlined"
            defaultValue={500}
            inputProps={{
              'aria-label': 'set max number of attendees',
              min: 0,
              max: 1000,
              ref: register,
            }}
            disabled={!hasMaxNumAttendees}
          />
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={submitting}
              type="submit"
              aria-label="create room"
            >
              Create
            </Button>
          </div>
          <Error>{serverError}</Error>
        </form>
      </Page>
    </Layout>
  )
}

function Error(props: {children: ValidationError<CreateRoomData> | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText>{props.children.message}</ErrorText>
}

function useCreateRoom() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()

  const url = api(`/events/${event.slug}/areas/${area.id}/rooms`)
  return (data: CreateRoomData) => client.post<Room>(url, data)
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

const ErrorText = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]};
  color: ${(props) => props.theme.colors.error};
`
