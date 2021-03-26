import TextField from '@material-ui/core/TextField'
import {AGENDA_LIST} from 'Event/Dashboard/components/AgendaList'
import {useTemplate, useUpdateObject} from 'Event/TemplateProvider'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export type AgendaListConfig = {
  type: typeof AGENDA_LIST
}

export function AgendaListConfig() {
  const {agenda: agendas} = useTemplate()
  const updateAgendasList = useUpdateObject('agenda')

  return (
    <>
      <TextField
        value={agendas.title}
        inputProps={{
          'aria-label': 'update agendas title',
        }}
        label="Title"
        fullWidth
        onChange={onChangeStringHandler(updateAgendasList('title'))}
      />
    </>
  )
}
