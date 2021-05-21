import TextField from '@material-ui/core/TextField'
import {AGENDA_LIST} from 'Event/Dashboard/components/AgendaList'
import {useTemplate, useUpdateObject} from 'Event/TemplateProvider'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'
import FontStyleInput from 'lib/ui/typography/FontStyleInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'

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
      <FormControl fullWidth>
        <InputLabel htmlFor="agenda-adornment-description">
          Description
        </InputLabel>
        <Input
          id="agenda-adornment-description"
          type="text"
          value={agendas.description || ''}
          onChange={onChangeStringHandler(updateAgendasList('description'))}
          aria-label="update agendas description"
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              <FontStyleInput
                onChange={updateAgendasList('descriptionFontStyles')}
                value={agendas.descriptionFontStyles || []}
              />
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel htmlFor="agenda-adornment-footer">Footer</InputLabel>
        <Input
          id="agenda-adornment-footer"
          type="text"
          value={agendas.footer || ''}
          onChange={onChangeStringHandler(updateAgendasList('footer'))}
          aria-label="update agendas footer"
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              <FontStyleInput
                onChange={updateAgendasList('footerFontStyles')}
                value={agendas.footerFontStyles || []}
              />
            </InputAdornment>
          }
        />
      </FormControl>
    </>
  )
}
