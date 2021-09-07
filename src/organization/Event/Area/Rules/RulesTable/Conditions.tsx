import {Rule} from 'organization/Event/Area/Rules/RulesProvider'
import {Rule as AttendeeRule} from 'Event/attendee-rules/index'
import React from 'react'
import {
  TAGS,
  TagsRule,
} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {
  GROUP,
  GroupRule,
} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import {
  NestedRule,
  NESTED_RULE,
} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import {List} from 'organization/Event/Area/Rules/RulesTable'

export default function Conditions(props: {rule: Rule}) {
  const {
    rule: {conditions},
  } = props

  const hasConditions = conditions.length > 0
  if (!hasConditions) {
    return <em>None</em>
  }

  return (
    <List>
      {conditions.map((condition, index) => (
        <li key={index}>
          <Operation isFirst={index === 0} rule={condition} />
          <Label condition={condition} />
        </li>
      ))}
    </List>
  )
}

function Operation(props: {isFirst: boolean; rule: AttendeeRule}) {
  const {isFirst, rule} = props
  /**
   * If it's the first rule the condition doesn't really matter, as it
   * will always look for a match.
   */
  if (isFirst) {
    return null
  }

  /**
   * Condition here would be 'And', or 'Or'
   */
  return <span>{rule.condition.toLocaleLowerCase()} </span>
}

function Label(props: {condition: AttendeeRule}) {
  const {condition} = props

  switch (condition.source) {
    case TAGS:
      return <TagLabel rule={condition} />
    case GROUP:
      return <GroupLabel rule={condition} />
    case NESTED_RULE:
      return <NestedLabel rule={condition} />
  }
}

function TagLabel(props: {rule: TagsRule}) {
  const {rule} = props
  return (
    <span>
      Tags {rule.type} {rule.target}
    </span>
  )
}

function GroupLabel(props: {rule: GroupRule}) {
  const {rule} = props
  return (
    <span>
      {rule.key} {rule.type} {rule.target}
    </span>
  )
}

function NestedLabel(props: {rule: NestedRule}) {
  const {rule} = props
  return <span>Matches {rule.rules.length} rules</span>
}
