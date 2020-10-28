import {GroupRule as Rule} from 'Dashboard/component-rules/sources/GroupRule/group-rule'
import React from 'react'

export default function GroupRule(props: {rule: Rule}) {
  return (
    <div>
      {props.rule.key} {props.rule.type} {props.rule.target}
    </div>
  )
}
