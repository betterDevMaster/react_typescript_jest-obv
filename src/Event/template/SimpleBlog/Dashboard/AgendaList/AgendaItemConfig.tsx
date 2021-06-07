import React from 'react'
import {useCallback} from 'react'
import styled from 'styled-components'
import {DateTimePicker} from '@material-ui/pickers'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {
  AGENDA_ITEM,
  Agenda,
} from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export type AgendaItemConfig = {
  type: typeof AGENDA_ITEM
  id: number
}

export function AgendaItemConfig(props: {id: AgendaItemConfig['id']}) {
  const {template} = useSimpleBlog()
  const {agenda: agendas} = template
  const updateTemplate = useDispatchUpdate()
  const closeConfig = useCloseConfig()

  if (!agendas) {
    throw new Error('Missing agendas; was it set properly via edit?')
  }

  if (props.id === undefined || typeof props.id !== 'number') {
    throw new Error('Missing component id')
  }

  const agenda = agendas.items[props.id]

  const update = useCallback(
    <T extends keyof Agenda>(key: T) =>
      (value: Agenda[T]) => {
        const updated = {
          ...agenda,
          [key]: value,
        }

        updateTemplate({
          agenda: {
            ...agendas,
            items: agendas.items.map((r, index) => {
              const isTarget = index === props.id
              if (isTarget) {
                return updated
              }

              return r
            }),
          },
        })
      },
    [agendas, props.id, agenda, updateTemplate],
  )

  const remove = () => {
    const withoutTarget = agendas.items.filter((_, index) => index !== props.id)
    closeConfig()
    updateTemplate({
      agenda: {
        ...agendas,
        items: withoutTarget,
      },
    })
  }

  const updateDate =
    (key: 'startDate' | 'endDate') => (date: MaterialUiPickersDate) => {
      if (date) {
        update(key)(date.toISOString())
        return
      }

      /**
       * End date is clear-able so we'll set it to null if
       * it was cleared. ie. didn't receive a date.
       */
      if (key === 'endDate') {
        update(key)(null)
        return
      }

      throw new Error('Start date cannot be empty')
    }

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Switch
          checked={agenda.isVisible}
          onChange={onChangeCheckedHandler(update('isVisible'))}
          arial-label="config visible switch"
          labelPlacement="start"
          color="primary"
          label={agenda.isVisible ? 'Enable' : 'Disable'}
        />
      </Box>
      <TextField
        value={agenda.text}
        inputProps={{
          'aria-label': 'agenda text',
        }}
        label="Event"
        fullWidth
        onChange={onChangeStringHandler(update('text'))}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DateTimePicker
            value={agenda.startDate}
            onChange={updateDate('startDate')}
            fullWidth
            label="Start"
            inputProps={{
              'aria-label': 'agenda start date',
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <DateTimePicker
            clearable
            value={agenda.endDate}
            onChange={updateDate('endDate')}
            fullWidth
            label="End"
            inputProps={{
              'aria-label': 'agenda end date',
            }}
          />
        </Grid>
      </Grid>
      <TextField
        value={agenda.link || ''}
        inputProps={{
          'aria-label': 'agenda link',
        }}
        label="Link"
        fullWidth
        onChange={onChangeStringHandler(update('link'))}
      />
      <RemoveAgendaButton
        fullWidth
        variant="outlined"
        aria-label="remove agenda"
        onClick={remove}
      >
        REMOVE AGENDA
      </RemoveAgendaButton>
    </>
  )
}

const RemoveAgendaButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
