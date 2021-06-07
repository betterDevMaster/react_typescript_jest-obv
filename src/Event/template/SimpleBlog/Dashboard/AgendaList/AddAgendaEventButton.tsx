import React from 'react'
import Button from '@material-ui/core/Button'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {AGENDA_ITEM} from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import {useDispatch} from 'react-redux'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export default function AddAgendaEventButton(props: {className?: string}) {
  const {template} = useSimpleBlog()
  const {agenda: agendas} = template
  const updateTemplate = useDispatchUpdate()
  const dispatch = useDispatch()

  const addAgenda = () => {
    const list = [
      ...agendas.items,
      {
        text: 'Event',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        link: null,
        isVisible: true,
      },
    ]
    updateTemplate({
      agenda: {
        ...agendas,
        items: list,
      },
    })

    const lastItem = list.length - 1
    dispatch(setConfig({type: AGENDA_ITEM, id: lastItem}))
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add agenda event"
      onClick={addAgenda}
      className={props.className}
    >
      Add Agenda Event
    </Button>
  )
}
