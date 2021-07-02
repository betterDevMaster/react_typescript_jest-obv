import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import ColorPicker from 'lib/ui/ColorPicker'
import {TicketRibbon} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbon'
import React, {useEffect, useState} from 'react'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {onChangeStringHandler} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import DefaultRibbonSelect from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig/DefaultRibbonSelect'
import CustomRibbonUpload from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig/CustomRibbonUpload'
import CustomRibbonImage, {
  useDeleteCustomRibbon,
} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig/CustomRibbonImage'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'

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
    index?: number
    ticketRibbon: TicketRibbon
  },
) {
  const {index, isVisible, onClose, ticketRibbon} = props
  const {
    template: {ticketRibbons},
  } = useSimpleBlog()
  const updateTemplate = useDispatchUpdate()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const deleteCustomRibbon = useDeleteCustomRibbon()
  const {control, handleSubmit} = useForm()

  const [rules, setRules] = useState(ticketRibbon.rules)
  const [text, setText] = useState(ticketRibbon.text)
  const [customRibbon, setCustomRibbon] = useState(ticketRibbon.customRibbon)

  useEffect(() => {
    if (isVisible) {
      return
    }

    setRules(ticketRibbon.rules)
    setText(ticketRibbon.text)
    setCustomRibbon(ticketRibbon.customRibbon)
  }, [isVisible, ticketRibbon])

  const update = (index: number, updated: TicketRibbon) => {
    updateTemplate({
      ticketRibbons: ticketRibbons.map((tr, i) => {
        const isTarget = i === index
        if (isTarget) {
          return updated
        }

        return tr
      }),
    })
  }

  const insert = (newRibbon: TicketRibbon) => {
    updateTemplate({
      ticketRibbons: [...ticketRibbons, newRibbon],
    })
  }

  const save = (formData: any) => {
    const ribbon: TicketRibbon = {
      ...formData,
      rules,
      text,
      customRibbon,
    }

    if (index !== undefined) {
      update(index, ribbon)
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

  const remove = async () => {
    if (index === undefined) {
      throw new Error('Missing index for ticket ribbon')
    }

    if (ticketRibbon.customRibbon) {
      try {
        await deleteCustomRibbon(ticketRibbon.customRibbon)
      } catch {
        /**
         * Ignore - if a model/image has already been removed
         * on server due to an aborted request, this will
         * fail. So we'll just ignore it, and proceed.
         */
      }
    }

    const removed = ticketRibbons.filter((_, i) => i !== index)
    onClose()
    updateTemplate({
      ticketRibbons: removed,
    })
  }

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
            <CustomRibbonUpload {...configProps} />
            <CustomRibbonImage {...configProps} />
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
