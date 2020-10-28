import React from 'react'
import {NestedRule as Rule} from 'Dashboard/component-rules/sources/NestedRule/nested-rule'

export default function NestedRule(props: {rule: Rule}) {
  const numRules = props.rule.rules.length
  return <div>these rules ({numRules}) are true</div>
}
