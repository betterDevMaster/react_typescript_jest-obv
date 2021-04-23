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
      <TextField
        value={agendas.description || ''}
        inputProps={{
          'aria-label': 'update agendas description',
        }}
        label="Description"
        fullWidth
        onChange={onChangeStringHandler(updateAgendasList('description'))}
      />
      <TextField
        value={agendas.footer || ''}
        inputProps={{
          'aria-label': 'update agendas footer',
        }}
        label="Footer"
        fullWidth
        onChange={onChangeStringHandler(updateAgendasList('footer'))}
      />
    </>
  )
}
