import React from 'react'
import styled from 'styled-components'

import {Description} from 'lib/ui/typography'
import Visible from 'lib/ui/layout/Visible'
import {Rule} from 'lib/ui/RulesConfig'
import {spacing} from 'lib/ui/theme'
import RuleComponent from 'lib/ui/RulesConfig/RuleList/SingleRule'

export default function RuleList(props: {
  rules?: Rule[]
  close?: () => void
  onChange: (rules: Rule[]) => void
  onToggleRuleConfig?: () => void
  descriptionHidden?: boolean
  className?: string
  description?: string
  disabled?: boolean
  nestedDeep: number
}) {
  const rules = props.rules || []

  return (
    <RuleContainer className={props.className} ml={spacing[props.nestedDeep]}>
      <Rules
        rules={rules}
        descriptionHidden={props.descriptionHidden}
        description={props.description}
        nestedDeep={props.nestedDeep + 1}
      />
    </RuleContainer>
  )
}

export function Rules(props: {
  rules: Rule[]
  descriptionHidden?: boolean
  description?: string
  nestedDeep: number
}) {
  const hasRules = props.rules.length > 0

  if (!hasRules && !props.descriptionHidden) {
    return <EmptyRulesText>No rule have been added</EmptyRulesText>
  }

  return (
    <RulesContainer>
      <Visible when={!props.descriptionHidden}>
        <Description>{props.description ? props.description : ' '}</Description>
      </Visible>
      {props.rules.map((rule, index) => (
        <StyledRule
          key={index}
          rule={rule}
          isFirstRule={index === 0}
          nestedDeep={props.nestedDeep}
        />
      ))}
    </RulesContainer>
  )
}

const RulesContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`

const EmptyRulesText = styled.p`
  margin: ${(props) => props.theme.spacing[4]} 0;
  text-align: center;
`

const StyledRule = styled(RuleComponent)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const RuleContainer = styled.div<{ml: string}>`
  border: 1px solid #939393;
  border-radius: 4px;
  padding: 15px;
  margin-left: ${(props) => props.ml};
`
