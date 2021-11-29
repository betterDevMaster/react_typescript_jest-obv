import React, {useEffect, useState, useCallback} from 'react'
import {v4 as uuid} from 'uuid'
import styled from 'styled-components'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {Agenda} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {REMOVE, useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

export function AgendaItemConfig(
  props: {
    agenda: Agenda
    id?: string
  } & ComponentConfigProps,
) {
  const {isVisible: visible, onClose, agenda, id} = props
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
        [id]: updated,
      },
    })
  }

  const insert = (item: Agenda) => {
    const id = uuid()

    updateItem({
      items: {
        [id]: item,
      },
    })
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

  const remove = useCallback(() => {
    if (!id) {
      throw new Error("Missing 'id' of agenda to remove.")
    }

    updateItem({
      items: {
        [id]: REMOVE,
      },
    })

    onClose()
  }, [updateItem, id, onClose])

  useRemoveIfEmpty(remove, agenda)

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
