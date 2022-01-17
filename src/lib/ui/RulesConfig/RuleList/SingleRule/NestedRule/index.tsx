import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import {BaseRule, Rule} from 'lib/ui/RulesConfig'
import RuleComponent from 'lib/ui/RulesConfig/RuleList/SingleRule'

export const NESTED_RULE = 'Nested Rule'
export type NestedRule = BaseRule & {
  source: typeof NESTED_RULE
  rules: Rule[]
}

export default function NestedRule(props: {
  rule: NestedRule
  nestedDeep: number
}) {
  const [rules, setRules] = useState(props.rule.rules)

  useEffect(() => {
    setRules(rules)
  }, [props.rule])

  return (
    <>
      {rules.map((rule, index) => (
        <StyledRule
          key={index}
          rule={rule}
          isFirstRule={index === 0}
          nestedDeep={props.nestedDeep}
        />
      ))}
    </>
  )
}

const StyledRule = styled(RuleComponent)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`
