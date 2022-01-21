import React, {useState, useEffect} from 'react'
import Box from 'lib/ui/Box'
import AttendeeProfileProvider from 'Event/attendee-rules/AttendeeProfileProvider'
import RuleList from 'lib/ui/RulesConfig/RuleList'
import {TagsRuleConfig} from 'lib/ui/RulesConfig/RuleList/SingleRule/TagsRule'
import {GroupRuleConfig} from 'lib/ui/RulesConfig/RuleList/SingleRule/GroupRule'
import {NestedRuleConfig} from 'lib/ui/RulesConfig/RuleList/SingleRule/NestedRule'

export interface HasRules {
  rules?: Rule[]
}

export const AND = 'And'
export const OR = 'Or'
export type Condition = typeof AND | typeof OR

export type BaseRule = {
  condition: Condition
}

export type Rule = TagsRuleConfig | GroupRuleConfig | NestedRuleConfig
export interface HasRules {
  rules?: Rule[]
}

export type RulesProps = {
  rules?: Rule[]
  onChange: (rules: Rule[]) => void
  disabled?: boolean
  description?: string
}

export default function Rules(props: RulesProps) {
  const [rules, setRules] = useState(props.rules)

  useEffect(() => {
    setRules(props.rules)
  }, [props.rules])

  return (
    <AttendeeProfileProvider groups={{}} tags={[]}>
      <Box>
        <RuleList
          disabled={props.disabled}
          rules={rules}
          onChange={setRules}
          description={props.description}
          nestedDeep={0}
        />
      </Box>
    </AttendeeProfileProvider>
  )
}
