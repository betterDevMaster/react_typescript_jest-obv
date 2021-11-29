import styled from 'styled-components'
import {v4 as uuid} from 'uuid'
import TextField from '@material-ui/core/TextField'
import ColorPicker from 'lib/ui/ColorPicker'
import {TicketRibbon} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import React, {useCallback, useEffect, useState} from 'react'
import {onChangeStringHandler} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import DefaultRibbonSelect from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbonConfig/DefaultRibbonSelect'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'
import TicketRibbonUpload from 'organization/Event/DashboardConfig/TicketRibbonUpload'
import {useDeleteCustomRibbon} from 'organization/Event/DashboardConfig/TicketRibbonUpload/UploadedTicketRibbon'
import {REMOVE, useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

const MAX_NUM_CHARACTERS = 9

export interface TicketRibbonConfigProps {
  control: UseFormMethods['control']
  customRibbon?: TicketRibbon['customRibbon']
  setCustomRibbon: (customRibbon: TicketRibbon['customRibbon']) => void
  processing: boolean
  setProcessing: (procesing: boolean) => void
  ticketRibbon: TicketRibbon
}

export function TicketRibbonConfig(
  props: ComponentConfigProps & {
    id?: string
    ticketRibbon: TicketRibbon
  },
) {
  const {isVisible, onClose, ticketRibbon, id} = props
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const deleteCustomRibbon = useDeleteCustomRibbon()
  const {control, handleSubmit} = useForm()

  const [rules, setRules] = useState(ticketRibbon.rules)
  const [text, setText] = useState(ticketRibbon.text)
  const [customRibbon, setCustomRibbon] = useState(ticketRibbon.customRibbon)
  const {update: updateItem} = useEditSidebarItem()

  useEffect(() => {
    if (isVisible) {
      return
    }

    setRules(ticketRibbon.rules)
    setText(ticketRibbon.text)
    setCustomRibbon(ticketRibbon.customRibbon)
  }, [isVisible, ticketRibbon])

  const update = (id: string, updated: TicketRibbon) => {
    updateItem({
      ribbons: {
        [id]: updated,
      },
    })
  }

  const insert = (newRibbon: TicketRibbon) => {
    const id = uuid()

    updateItem({
      ribbons: {
        [id]: newRibbon,
      },
    })
  }

  const save = (formData: any) => {
    const ribbon: TicketRibbon = {
      ...formData,
      rules,
      text,
      customRibbon,
    }

    if (id !== undefined) {
      update(id, ribbon)
      onClose()
      return
    }

    insert(ribbon)
    onClose()
  }

  const configProps = {
    processing,
    setProcessing,
    ticketRibbon,
    customRibbon,
    setCustomRibbon,
    control,
  }

  const remove = useCallback(() => {
    if (!id) {
      throw new Error('Missing id')
    }

    if (ticketRibbon.customRibbon) {
      deleteCustomRibbon(ticketRibbon.customRibbon).catch(() => {
        /**
         * Ignore - if a model/image has already been removed
         * on server due to an aborted request, this will
         * fail. So we'll just ignore it, and proceed.
         */
      })
    }

    updateItem({
      ribbons: {
        [id]: REMOVE,
      },
    })

    onClose()
  }, [deleteCustomRibbon, id, onClose, ticketRibbon, updateItem])

  useRemoveIfEmpty(remove, ticketRibbon, {shouldSkip: !id})

  const onChangeText = (val: string) => {
    const exceedsCharacterLimit = val.length > MAX_NUM_CHARACTERS
    if (exceedsCharacterLimit) {
      setError(`Maximum of ${MAX_NUM_CHARACTERS} characters`)
      return
    }

    setError('')

    setText(val)
  }

  return (
    <ComponentConfig
      isVisible={isVisible}
      onClose={onClose}
      title="Ticket Ribbon"
    >
      <RuleConfig
        visible={ruleConfigVisible}
        close={toggleRuleConfig}
        rules={rules}
        onChange={setRules}
      >
        <>
          <ConfigureRulesButton onClick={toggleRuleConfig} />
          <form onSubmit={handleSubmit(save)}>
            <DefaultRibbonSelect {...configProps} />
            <TicketRibbonUpload {...configProps} width={800} height={150} />
            <TextField
              name="text"
              defaultValue={ticketRibbon.text}
              label="Text"
              fullWidth
              onChange={onChangeStringHandler(onChangeText)}
              inputProps={{
                'aria-label': 'ticket ribbon text input',
              }}
              error={!!error}
              helperText={error}
            />
            <Controller
              name="color"
              control={control}
              defaultValue={ticketRibbon.color}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Ribbon Text Color"
                  color={value}
                  onPick={onChange}
                />
              )}
            />
            <SaveButton type="submit" />
            <RemoveButton
              fullWidth
              variant="outlined"
              aria-label="remove ticket ribbon"
              onClick={remove}
            >
              REMOVE TICKET RIBBON
            </RemoveButton>
          </form>
        </>
      </RuleConfig>
    </ComponentConfig>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
