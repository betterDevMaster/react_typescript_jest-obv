import React from 'react'
import {Button} from '@material-ui/core'
import {setDashboard} from 'Dashboard/edit/state/actions'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export default function AddAgendaEventButton(props: {className?: string}) {
  const dispatch = useDispatch()
  const agendas = useSelector(
    (state: RootState) => state.dashboardEditor.agendas,
  )

  const existingAgendas = agendas || []

  const addEvent = () => {
    dispatch(
      setDashboard({
        agendas: [
          ...existingAgendas,
          {
            text: 'Event',
            startDate: new Date().toISOString(),
            endDate: null,
            link: null,
          },
        ],
      }),
    )
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
