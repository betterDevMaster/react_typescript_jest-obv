import React, {useEffect, useCallback} from 'react'
import styled from 'styled-components'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {Agenda} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList'
import {onChangeCheckedHandler, onChangeDate} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {REMOVE, useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import {v4 as uuid} from 'uuid'
import {Controller, useForm} from 'react-hook-form'
import moment from 'moment'

export function AgendaItemConfig(
  props: {
    agenda: Agenda
    id?: string
  } & ComponentConfigProps,
) {
  const {isVisible: visible, onClose, agenda, id} = props

  const {handleSubmit, register, control, watch, setValue} = useForm()

  const {update: updateItem} = useEditSidebarItem()

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  useEffect(() => {
    if (!startDate || !endDate) {
      return
    }

    const shouldAdjustEndDate = moment(startDate).isBefore(moment(endDate))
    if (!shouldAdjustEndDate) {
      return
    }

    setValue('endDate', startDate)
  }, [startDate, endDate, setValue])

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
  }, [id, onClose, updateItem])

  useRemoveIfEmpty(remove, agenda, {shouldSkip: !id})

  const save = (data: Agenda) => {
    if (id === undefined) {
      insert(data)
      onClose()
      return
    }

    update(id, data)
    onClose()
  }

  return (
    <ComponentConfig isVisible={visible} onClose={onClose} title="Agenda">
      <form onSubmit={handleSubmit(save)}>
        <Box display="flex" justifyContent="flex-end">
          <Controller
            name="isVisible"
            defaultValue={agenda.isVisible}
            control={control}
            render={({value, onChange}) => (
              <Switch
                checked={value}
                onChange={onChangeCheckedHandler(onChange)}
                arial-label="config visible switch"
                labelPlacement="start"
                color="primary"
                label="Enabled"
              />
            )}
          />
        </Box>
        <TextField
          name="text"
          defaultValue={agenda.text}
          inputProps={{
            'aria-label': 'agenda text',
            ref: register,
          }}
          label="Event"
          fullWidth
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="startDate"
              defaultValue={agenda.startDate}
              control={control}
              render={({value, onChange}) => (
                <LocalizedDateTimePicker
                  value={value}
                  onChange={onChangeDate(onChange)}
                  fullWidth
                  label="Start"
                  inputProps={{
                    'aria-label': 'agenda start date',
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="endDate"
              defaultValue={agenda.endDate}
              control={control}
              render={({value, onChange}) => (
                <LocalizedDateTimePicker
                  clearable
                  value={value}
                  onChange={onChangeDate(onChange)}
                  fullWidth
                  label="End"
                  inputProps={{
                    'aria-label': 'agenda end date',
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <TextField
          name="link"
          defaultValue={agenda.link}
          inputProps={{
            'aria-label': 'agenda link',
            ref: register,
          }}
          label="Link"
          fullWidth
        />
        <SaveButton />
        <RemoveAgendaButton
          fullWidth
          variant="outlined"
          aria-label="remove agenda"
          onClick={remove}
          hidden={!id}
        >
          REMOVE AGENDA
        </RemoveAgendaButton>
      </form>
    </ComponentConfig>
  )
}

const RemoveAgendaButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[2]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`
