import {NestedRule as Rule} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule/nested-rule'
import React from 'react'

export default function NestedRule(props: {rule: Rule}) {
  const numRules = props.rule.rules.length
  return <div>these rules ({numRules}) are true</div>
}
