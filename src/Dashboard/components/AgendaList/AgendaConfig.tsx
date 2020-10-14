import React from 'react'

import {DateTimePicker} from '@material-ui/pickers'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {Component, setDashboard} from 'Dashboard/edit/state/actions'
import {Agenda} from 'Dashboard/components/AgendaList'
import {onChangeStringHandler} from 'lib/dom'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'

export default function AgendaConfig(props: {component: Component}) {
  const agendas = useSelector(
    (state: RootState) => state.dashboardEditor.agendas,
  )
  const dispatch = useDispatch()

  if (!agendas) {
    throw new Error('Missing agendas; was it set properly via edit?')
  }

  if (
    props.component.id === undefined ||
    typeof props.component.id !== 'number'
  ) {
    throw new Error('Missing component id')
  }

  const agenda = agendas[props.component.id]

  const update = <T extends keyof Agenda>(key: T) => (value: Agenda[T]) => {
    const updated = {
      ...agenda,
      [key]: value,
    }

    dispatch(
      setDashboard({
        agendas: agendas.map((a, index) => {
          const isTarget = index === props.component.id
          if (isTarget) {
            return updated
          }

          return a
        }),
      }),
    )
  }

  const updateDate = (key: 'startDate' | 'endDate') => (
    date: MaterialUiPickersDate,
  ) => {
    if (date) {
      update(key)(date.toISOString())
      return
    }

    if (key === 'endDate') {
      update(key)(null)
      return
    }

    throw new Error('Start date cannot be empty')
  }

  return (
    <>
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
    </>
  )
}
