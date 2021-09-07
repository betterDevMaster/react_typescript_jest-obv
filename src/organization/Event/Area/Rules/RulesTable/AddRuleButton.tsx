import Button from '@material-ui/core/Button'
import {uuid} from 'lib/uuid'
import {Rule, useRules} from 'organization/Event/Area/Rules/RulesProvider'
import React from 'react'

export default function AddRuleButton() {
  const list = useRules()

  const add = () => {
    const newRule: Rule = {
      id: uuid(),
      conditions: [],
      rooms: [],
    }

    list.add(newRule)
  }

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={add}
      aria-label="add rule"
      disabled={list.processing}
    >
      New Rule
    </Button>
  )
}
