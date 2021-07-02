import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import {Agenda} from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import {AgendaItemConfig} from 'Event/template/SimpleBlog/Dashboard/AgendaList/AgendaItemConfig'

export default function AddAgendaButton(props: {className?: string}) {
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
      <NewAgendaConfig agenda={agenda} onClose={() => setAgenda(null)} />
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

function NewAgendaConfig(props: {agenda: Agenda | null; onClose: () => void}) {
  const {agenda, onClose} = props
  if (!agenda) {
    return null
  }

  return <AgendaItemConfig onClose={onClose} agenda={agenda} isVisible />
}
