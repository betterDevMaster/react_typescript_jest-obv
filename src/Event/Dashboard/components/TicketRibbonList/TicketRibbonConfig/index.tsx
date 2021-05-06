import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import ColorPicker from 'lib/ui/ColorPicker'
import {
  TicketRibbon,
  TICKET_RIBBON_IMAGE,
  TICKET_RIBBON,
} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import React, {useState} from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {onChangeStringHandler, onUnknownChangeHandler} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import RuleConfig, {
  useRuleConfig,
} from 'Event/Dashboard/component-rules/RuleConfig'
import ConfigureRulesButton from 'Event/Dashboard/component-rules/ConfigureRulesButton'

export type TicketRibbonConfig = {
  type: typeof TICKET_RIBBON
  index: number
}

const MAX_NUM_CHARACTERS = 9

export function TicketRibbonConfig(props: {index: number}) {
  const {ticketRibbons} = useTemplate()
  const ticketRibbon = ticketRibbons[props.index]
  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const [error, setError] = useState('')

  if (ticketRibbon === undefined) {
    throw new Error('Missing ticket ribbon; was it set properly via edit?')
  }

  const update = <T extends keyof TicketRibbon>(key: T) => (
    value: TicketRibbon[T],
  ) => {
    const updated = {
      ...ticketRibbon,
      [key]: value,
    }

    updateTemplate({
      ticketRibbons: ticketRibbons.map((tr, index) => {
        const isTarget = index === props.index
        if (isTarget) {
          return updated
        }

        return tr
      }),
    })
  }

  const remove = () => {
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

  return (
    <RuleConfig
      visible={ruleConfigVisible}
      close={toggleRuleConfig}
      rules={ticketRibbon.rules}
      onChange={update('rules')}
    >
      <>
        <ConfigureRulesButton onClick={toggleRuleConfig} />
        <FormControl fullWidth>
          <Select
            value={ticketRibbon.name}
            inputProps={{
              'aria-label': 'pick ticket ribbon',
            }}
            onChange={onUnknownChangeHandler(update('name'))}
          >
            {Object.entries(TICKET_RIBBON_IMAGE).map(([name, image]) => (
              <MenuItem key={name} value={name}>
                <Image src={image} alt={name} />
                <span>{name}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="text"
          defaultValue={ticketRibbon.text}
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

const Image = styled.img`
  margin-right: ${(props) => props.theme.spacing[2]};
  width: 40px;
`

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
