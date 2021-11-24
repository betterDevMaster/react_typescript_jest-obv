import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {
  Agenda,
  AgendaListProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {REMOVE} from 'Event/TemplateUpdateProvider'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import {v4 as uuid} from 'uuid'

export function AgendaItemConfig(
  props: {
    agenda: Agenda
    list: AgendaListProps
    id?: string
  } & ComponentConfigProps,
) {
  const {isVisible: visible, onClose, agenda, list, id} = props
  const [isVisible, setIsVisible] = useState(agenda.isVisible)
  const [text, setText] = useState(agenda.text)
  const [startDate, setStartDate] = useState(agenda.startDate)
  const [endDate, setEndDate] = useState(agenda.endDate)
  const [link, setLink] = useState(agenda.link)
  const [hasEndDateTimeChange, setHasEndDateTimeChange] = useState(false)

  const {update: updateItem} = useEditSidebarItem()

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
    setHasEndDateTimeChange(false)
  }, [agenda, visible])

  const update = (id: string, updated: Agenda) => {
    updateItem({
      items: {
        entities: {
          [id]: updated,
        },
      },
    })
  }

  const insert = (item: Agenda) => {
    const id = uuid()
    const ids = [...list.items.ids, id]

    updateItem({
      items: {
        ids,
        entities: {
          [id]: item,
        },
      },
    })
  }

  const remove = () => {
    if (!id) {
      throw new Error("Missing 'id' of agenda to remove.")
    }

    const removed = list.items.ids.filter((i) => i !== id)

    updateItem({
      items: {
        ids: removed,
        entities: {
          [id]: REMOVE,
        },
      },
    })

    onClose()
  }

  const save = () => {
    const data: Agenda = {
      isVisible,
      text,
      startDate,
      endDate,
      link,
    }

    if (id === undefined) {
      insert(data)
      onClose()
      return
    }

    update(id, data)
    onClose()
  }

  const handleStartDate = (date: MaterialUiPickersDate) => {
    if (!date) {
      throw new Error('Date is required')
    }
    setStartDate(date.toISOString())

    if (!hasEndDateTimeChange) {
      setEndDate(date.toISOString())
    }
  }

  const handleEndDate = (date: MaterialUiPickersDate) => {
    if (!date) {
      throw new Error('Date is required')
    }
    setEndDate(date.toISOString())
    setHasEndDateTimeChange(true)
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
            onChange={handleEndDate}
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
        hidden={!id}
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
