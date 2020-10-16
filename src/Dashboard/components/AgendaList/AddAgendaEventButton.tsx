import React from 'react'
import {Button} from '@material-ui/core'
import {RootState} from 'store'
import {useUpdateDashboard} from 'Dashboard/edit/state/edit-mode'
import {useSelector} from 'react-redux'

export default function AddAgendaEventButton(props: {className?: string}) {
  const agendas = useSelector(
    (state: RootState) => state.dashboardEditor.agendas,
  )
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
