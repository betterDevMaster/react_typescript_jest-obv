import React from 'react'
import {BaseRule} from 'lib/ui/RulesConfig'

export const GROUP = 'Group'
export const IS = 'is equel to'
export const IS_NOT = 'is not equel to'
export type GroupRuleConfig = BaseRule & {
  source: typeof GROUP
  type: typeof IS | typeof IS_NOT
  key: string
  target: string
}

export default function GroupRule(props: {rule: GroupRuleConfig}) {
  return (
    <div>
      {props.rule.key} {props.rule.type} {props.rule.target}
    </div>
  )
}
