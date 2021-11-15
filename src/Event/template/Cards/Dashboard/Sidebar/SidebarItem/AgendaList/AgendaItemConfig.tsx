import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {
  Agenda,
  AgendaListProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList'
import {
  onChangeStringHandler,
  onChangeCheckedHandler,
  onChangeDate,
} from 'lib/dom'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {useUpdateSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'

export function AgendaItemConfig(
  props: {
    agenda: Agenda
    index?: number
    list: AgendaListProps
  } & ComponentConfigProps,
) {
  const {isVisible: visible, onClose, agenda, index} = props
  const {list: agendas} = props
  const [isVisible, setIsVisible] = useState(agenda.isVisible)
  const [text, setText] = useState(agenda.text)
  const [startDate, setStartDate] = useState(agenda.startDate)
  const [endDate, setEndDate] = useState(agenda.endDate)
  const [link, setLink] = useState(agenda.link)

  const updateItem = useUpdateSidebarItem()

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
    updateItem({
      ...agendas,
      items: agendas.items.map((r, i) => {
        const isTarget = i === index
        if (isTarget) {
          return data
        }

        return r
      }),
    })

  const insert = (item: Agenda) =>
    updateItem({
      ...agendas,
      items: [...agendas.items, item],
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
    updateItem({
      ...agendas,
      items: withoutTarget,
    })
  }

  const handleStartDate = (date: MaterialUiPickersDate) => {
    if (!date) {
      throw new Error('Date is required')
    }
    setStartDate(date.toISOString())
    setEndDate(date.toISOString())
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
          <LocalizedDateTimePicker
            value={startDate}
            onChange={handleStartDate}
            fullWidth
            label="Start"
            inputProps={{
              'aria-label': 'agenda start date',
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <LocalizedDateTimePicker
            clearable
            value={endDate}
            onChange={onChangeDate(setEndDate)}
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
