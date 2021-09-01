import React from 'react'
import Grid from '@material-ui/core/Grid'
import Page from 'organization/Event/Page'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {useEvent} from 'Event/EventProvider'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useOrganization} from 'organization/OrganizationProvider'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useRoomRoutes} from 'organization/Event/Room/RoomRoutes'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import {usePermissions, VIEW_RECORDINGS} from 'organization/PermissionsProvider'
import {Redirect} from 'react-router-dom'
import {api} from 'lib/url'
import {useCallback} from 'react'
import {useAsync} from 'lib/async'
import Layout from 'organization/user/Layout'
import MeetingCard from 'organization/Event/Room/Recordings/MeetingCard'

export interface RecordingList {
  meeting_uuid: string
  recordings: Recording[]
}

export interface Recording {
  name: string
  download_url: string
  recording_start: string
  recording_end: string
  recording_type: string
  file_size: number
  file_type: string
}

export default function Recordings() {
  const {room} = useRoom()
  const {event} = useEvent()
  const areaRoutes = useAreaRoutes()
  const eventRoutes = useEventRoutes()
  const {routes: orgRoutes} = useOrganization()
  const {area} = useArea()
  const roomRoutes = useRoomRoutes()
  const {loading, recordings} = useRecordings()

  useBreadcrumbs([
    {
      title: 'Events',
      url: orgRoutes.events.root,
    },
    {
      title: event.name,
      url: eventRoutes.root,
    },
    {title: area.name, url: areaRoutes.root},
    {title: room.name, url: roomRoutes.root},
    {title: 'Recordings', url: roomRoutes.recordings},
  ])

  const {can} = usePermissions()

  if (!can(VIEW_RECORDINGS)) {
    return <Redirect to={roomRoutes.root} />
  }

  if (!recordings || loading) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  const hasRecordings = recordings.length > 0
  if (!hasRecordings) {
    return (
      <Layout>
        <Page>
          <Title variant="h5">Recordings</Title>
          <div>No recordings have been made for this room yet.</div>
        </Page>
      </Layout>
    )
  }

  return (
    <Layout>
      <Page>
        <Title variant="h5">Recordings</Title>
        <Grid container spacing={4}>
          {recordings.map((list) => (
            <Items list={list} key={list.meeting_uuid} />
          ))}
        </Grid>
      </Page>
    </Layout>
  )
}

function Items(props: {list: RecordingList}) {
  const {list} = props

  const grouped = groupByStartTime(list.recordings)

  /**
   * If there's only 1 start time we won't be splitting it into parts
   */
  const hasParts = Object.keys(grouped).length > 1

  return (
    <>
      {Object.values(grouped).map((recordings, index) => (
        <Grid item xs={12} md={6} key={index}>
          <MeetingCard
            recordings={recordings}
            part={index + 1}
            hasMultipleParts={hasParts}
          />
        </Grid>
      ))}
    </>
  )
}

function groupByStartTime(recordings: Recording[]) {
  return recordings.reduce((acc, i) => {
    const list = acc[i.recording_start]

    const updated = list ? [...list, i] : [i]

    return {
      ...acc,
      [i.recording_start]: updated,
    }
  }, {} as Record<string, Recording[]>)
}

function useRecordings() {
  const {client} = useOrganization()
  const {room} = useRoom()
  const url = api(`/rooms/${room.id}/recordings`)

  const request = useCallback(() => client.get<RecordingList[]>(url), [
    client,
    url,
  ])

  const {data, loading} = useAsync(request)

  return {
    recordings: data,
    loading,
  }
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)
