import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {DateTimePicker} from '@material-ui/pickers'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {Agenda} from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export function AgendaItemConfig(
  props: {agenda: Agenda; index?: number} & ComponentConfigProps,
) {
  const {isVisible: visible, onClose, agenda, index} = props
  const {template} = useSimpleBlog()
  const {agenda: agendas} = template
  const updateTemplate = useDispatchUpdate()

  const [isVisible, setIsVisible] = useState(agenda.isVisible)
  const [text, setText] = useState(agenda.text)
  const [startDate, setStartDate] = useState(agenda.startDate)
  const [endDate, setEndDate] = useState(agenda.endDate)
  const [link, setLink] = useState(agenda.link)

  useEffect(() => {
    if (visible) {
      // Prevent losing current changes
      return
    }

    setIsVisible(agenda.isVisible)
    setText(agenda.text)
    setStartDate(agenda.startDate)
    setEndDate(agenda.endDate)
    setLink(agenda.link)
  }, [agenda, visible])

  const update = (data: Agenda, index: number) =>
    updateTemplate({
      agenda: {
        ...agendas,
        items: agendas.items.map((r, i) => {
          const isTarget = i === index
          if (isTarget) {
            return data
          }

          return r
        }),
      },
    })

  const insert = (item: Agenda) =>
    updateTemplate({
      agenda: {
        ...agendas,
        items: [...agendas.items, item],
      },
    })

  const save = () => {
    const data: Agenda = {
      isVisible,
      text,
      startDate,
      endDate,
      link,
    }

    if (index === undefined) {
      insert(data)
      onClose()
      return
    }

    update(data, index)
    onClose()
  }

  const remove = () => {
    const withoutTarget = agendas.items.filter((_, i) => i !== index)
    onClose()
    updateTemplate({
      agenda: {
        ...agendas,
        items: withoutTarget,
      },
    })
  }

  const handleDate = (setter: (value: string) => void) => (
    date: MaterialUiPickersDate,
  ) => {
    if (!date) {
      throw new Error('Date is required')
    }

    setter(date.toISOString())
  }

  const handleNullableDate = (setter: (value: string | null) => void) => (
    date: MaterialUiPickersDate,
  ) => {
    setter(date ? date.toISOString() : null)
  }

  return (
    <ComponentConfig isVisible={visible} onClose={onClose} title="Agenda">
      <Box display="flex" justifyContent="flex-end">
        <Switch
          checked={isVisible}
          onChange={onChangeCheckedHandler(setIsVisible)}
          arial-label="config visible switch"
          labelPlacement="start"
          color="primary"
          label={isVisible ? 'Enable' : 'Disable'}
        />
      </Box>
      <TextField
        value={text}
        inputProps={{
          'aria-label': 'agenda text',
        }}
        label="Event"
        fullWidth
        onChange={onChangeStringHandler(setText)}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DateTimePicker
            value={startDate}
            onChange={handleDate(setStartDate)}
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
            value={endDate}
            onChange={handleNullableDate(setEndDate)}
            fullWidth
            label="End"
            inputProps={{
              'aria-label': 'agenda end date',
            }}
          />
        </Grid>
      </Grid>
      <TextField
        value={link || ''}
        inputProps={{
          'aria-label': 'agenda link',
        }}
        label="Link"
        fullWidth
        onChange={onChangeStringHandler(setLink)}
      />
      <SaveButton onClick={save} />
      <RemoveAgendaButton
        fullWidth
        variant="outlined"
        aria-label="remove agenda"
        onClick={remove}
        hidden={!index}
      >
        REMOVE AGENDA
      </RemoveAgendaButton>
    </ComponentConfig>
  )
}

const RemoveAgendaButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[2]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`
