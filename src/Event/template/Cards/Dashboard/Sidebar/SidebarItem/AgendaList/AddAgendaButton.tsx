import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import {
  Agenda,
  AgendaListProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList'
import {AgendaItemConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList/AgendaItemConfig'

export default function AddAgendaButton(props: {
  className?: string
  list: AgendaListProps
}) {
  const [agenda, setAgenda] = useState<Agenda | null>(null)

  const newAgenda = (): Agenda => ({
    text: 'Event',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    link: null,
    isVisible: true,
  })

  return (
    <>
      <NewAgendaConfig
        agenda={agenda}
        onClose={() => setAgenda(null)}
        list={props.list}
      />
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="secondary"
        aria-label="add agenda event"
        onClick={() => setAgenda(newAgenda())}
        className={props.className}
      >
        Add Agenda Event
      </Button>
    </>
  )
}

function NewAgendaConfig(props: {
  agenda: Agenda | null
  onClose: () => void
  list: AgendaListProps
}) {
  const {agenda, onClose, list} = props
  if (!agenda) {
    return null
  }

  return (
    <AgendaItemConfig onClose={onClose} agenda={agenda} list={list} isVisible />
  )
}
