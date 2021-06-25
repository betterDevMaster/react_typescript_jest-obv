import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import ColorPicker from 'lib/ui/ColorPicker'
import {
  TicketRibbon,
  TICKET_RIBBON,
} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbon'
import React, {useCallback, useState} from 'react'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {onChangeStringHandler} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import DefaultRibbonSelect from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig/DefaultRibbonSelect'
import CustomRibbonUpload from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig/CustomRibbonUpload'
import CustomRibbonImage, {
  useDeleteCustomRibbon,
} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig/CustomRibbonImage'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export type TicketRibbonConfig = {
  type: typeof TICKET_RIBBON
  index: number
}

const MAX_NUM_CHARACTERS = 9

export interface TicketRibbonConfigProps {
  update: <T extends keyof TicketRibbon>(
    key: T,
  ) => (value: TicketRibbon[T]) => void
  processing: boolean
  setProcessing: (procesing: boolean) => void
  ticketRibbon: TicketRibbon
}

export function TicketRibbonConfig(props: {index: number}) {
  const {index} = props
  const {template} = useSimpleBlog()
  const {ticketRibbons} = template
  const ticketRibbon = ticketRibbons[props.index]
  const updateTemplate = useDispatchUpdate()
  const closeConfig = useCloseConfig()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const deleteCustomRibbon = useDeleteCustomRibbon()

  const update: TicketRibbonConfigProps['update'] = useCallback(
    (key) => (value) => {
      const updated = {
        ...ticketRibbon,
        [key]: value,
      }

      updateTemplate({
        ticketRibbons: ticketRibbons.map((tr, i) => {
          const isTarget = i === index
          if (isTarget) {
            return updated
          }

          return tr
        }),
      })
    },
    [index, ticketRibbons, ticketRibbon, updateTemplate],
  )

  const configProps = {
    processing,
    setProcessing,
    update,
    ticketRibbon,
  }

  const remove = async () => {
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

    const removed = ticketRibbons.filter((_, index) => index !== props.index)
    closeConfig()
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
    update('text')(val)
  }

  if (ticketRibbon === undefined) {
    throw new Error('Missing ticket ribbon; was it set properly via edit?')
  }

  return (
    <RuleConfig
      visible={ruleConfigVisible}
      close={toggleRuleConfig}
      rules={ticketRibbon.rules}
      onChange={update('rules')}
    >
      <>
        <ConfigureRulesButton onClick={toggleRuleConfig} />
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
        <ColorPicker
          label="Ribbon Text Color"
          color={ticketRibbon.color}
          onPick={update('color')}
        />
        <RemoveButton
          fullWidth
          variant="outlined"
          aria-label="remove ticket ribbon"
          onClick={remove}
        >
          REMOVE TICKET RIBBON
        </RemoveButton>
      </>
    </RuleConfig>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
