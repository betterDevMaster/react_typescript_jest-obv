import React from 'react'
import {Button} from '@material-ui/core'
import {
  useDashboard,
  useUpdateDashboard,
} from 'organization/Events/Dashboard/state/DashboardProvider'

export default function AddAgendaEventButton(props: {className?: string}) {
  const {agendas} = useDashboard()
  const updateDashboard = useUpdateDashboard()

  const existingAgendas = agendas || []

  const addEvent = () => {
    updateDashboard({
      agendas: [
        ...existingAgendas,
        {
          text: 'Event',
          startDate: new Date().toISOString(),
          endDate: null,
          link: null,
        },
      ],
    })
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add agenda event"
      onClick={addEvent}
      className={props.className}
    >
      Add Agenda Event
    </Button>
  )
}
