import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {ValidationError} from 'lib/ui/api-client'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import Layout from 'organization/user/Layout'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import {useValidatedForm} from 'lib/form'
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
import {useRooms} from 'organization/Event/Area/RoomsProvider'
import ProgressOverlay from 'organization/Event/Room/CreateRoomForm/ProgressOverlay'

interface CreateRoomData {
  max_num_attendees?: number
}

/**
 * How many rooms can be created at once.
 */
const MAX_NUM_ROOMS = 100

export default function CreateRoomForm() {
  const {
    register,
    handleSubmit,
    clearErrors,
    setResponseError,
    responseError,
  } = useValidatedForm<CreateRoomData>()
  const [processing, setProcessing] = useState(false)
  const history = useHistory()
  const createRoom = useCreateRoom()
  const areaRoutes = useAreaRoutes()
  const goToBackToArea = () => {
    history.push(areaRoutes.root)
  }
  const [hasMaxNumAttendees, setHasMaxNumAttendees] = useState(false)
  const {add} = useRooms()
  const [numCreated, setNumCreated] = useState(0)
  const [numTotal, setNumTotal] = useState(0)

  const submit = async ({max_num_attendees, num_rooms}: any) => {
    if (processing) {
      return
    }

    setNumCreated(0)
    setNumTotal(num_rooms)
    setProcessing(true)
    clearErrors()

    /**
     * Create rooms sequentially. Had to fire multiple requests because a single
     * request would timeout trying to create too many rooms.
     */
    for (let i = 0; i < num_rooms; i++) {
      const data: CreateRoomData = hasMaxNumAttendees ? {max_num_attendees} : {}
      try {
        const room = await createRoom(data)
        add(room)
        setNumCreated((current) => current + 1)

        const isLastRoom = i === num_rooms - 1
        if (isLastRoom) {
          goToBackToArea()
        }
      } catch (error: any) {
        setResponseError(error)
      }
    }
  }

  return (
    <Layout>
      <RelativePage>
        <Title variant="h5" align="center">
          Create Rooms
        </Title>
        <ProgressOverlay
          showing={processing}
          created={numCreated}
          total={numTotal}
          failed={Boolean(responseError)}
          onRetry={() => setProcessing(false)}
        />
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="Number of rooms"
            name="num_rooms"
            required
            defaultValue={1}
            fullWidth
            type="number"
            variant="outlined"
            inputProps={{
              ref: register({
                required: 'Number of rooms is required',
              }),
              'aria-label': 'number of rooms to create',
              min: 1,
              max: MAX_NUM_ROOMS,
            }}
            helperText={`You may create up to ${MAX_NUM_ROOMS} rooms at once.`}
            disabled={processing}
          />
          <FormControl
            required
            component="fieldset"
            fullWidth
            disabled={processing}
          >
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
            disabled={!hasMaxNumAttendees || processing}
          />
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={processing}
              type="submit"
              aria-label="create rooms"
            >
              Create
            </Button>
            <CancelButton
              disabled={processing}
              type="button"
              onClick={goToBackToArea}
            >
              Cancel
            </CancelButton>
          </div>
          <Error>{responseError}</Error>
        </form>
      </RelativePage>
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

const RelativePage = styled(Page)`
  position: relative;
`

const CancelButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing[2]};
`
