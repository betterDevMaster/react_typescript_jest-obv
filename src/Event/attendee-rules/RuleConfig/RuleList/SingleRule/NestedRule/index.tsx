import {AND, BaseRule, Rule} from 'Event/attendee-rules'
import React from 'react'

export const NESTED_RULE = 'Nested Rule'
export type NestedRule = BaseRule & {
  source: typeof NESTED_RULE
  rules: Rule[]
}

export default function NestedRuleLabel(props: {rule: NestedRule}) {
  const numRules = props.rule.rules.length
  return <div aria-label="nested rule">these rules ({numRules}) are true</div>
}

export const createNestedRule = (rules: Rule[]): NestedRule => ({
  condition: AND,
  source: NESTED_RULE,
  rules,
})
