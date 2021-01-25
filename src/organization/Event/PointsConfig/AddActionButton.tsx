import Button from '@material-ui/core/Button'
import {Action, useActions} from 'Event/ActionsProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'

export interface CreateActionData {
  description: string
  points: number
  max_per_day?: number
  max_per_event?: number
}

export default function AddActionButton(props: {
  onAdd: (action: Action) => void
}) {
  const createAction = useCreateAction(props.onAdd)

  return (
    <Button variant="contained" onClick={createAction} color="primary">
      Create Action
    </Button>
  )
}

function useCreateAction(onAdd: (action: Action) => void) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {custom} = useActions()

  const url = api(`/events/${event.slug}/actions`)

  const data: CreateActionData = {
    description: 'You got points!',
    points: 30,
    max_per_day: 1,
    max_per_event: 15,
  }

  return () =>
    client.post<Action>(url, data).then((action) => {
      custom.add(action)
      onAdd(action)
    })
}
