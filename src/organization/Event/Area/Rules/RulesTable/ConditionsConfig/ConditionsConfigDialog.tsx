import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import React from 'react'
import {Rule, useRules} from 'organization/Event/Area/Rules/RulesProvider'
import {Rule as AttendeeRule} from 'Event/attendee-rules'
import RuleConfig from 'Event/attendee-rules/RuleConfig'

export default function ConditionsConfigDialog(props: {
  showing: boolean
  onClose: () => void
  rule: Rule
}) {
  const {rule, showing, onClose} = props
  const list = useRules()

  const setConditions = (conditions: AttendeeRule[]) => {
    const updated: Rule = {
      ...rule,
      conditions,
    }

    list.update(updated)
  }

  return (
    <Dialog open={showing} onClose={onClose} fullWidth>
      <DialogTitle>Conditions</DialogTitle>
      <DialogContent>
        <RuleConfig
          visible
          onChange={setConditions}
          rules={props.rule.conditions}
          description={'Attendee will be assigned to selected room when'}
          disabled={list.processing}
        />
      </DialogContent>
    </Dialog>
  )
}
