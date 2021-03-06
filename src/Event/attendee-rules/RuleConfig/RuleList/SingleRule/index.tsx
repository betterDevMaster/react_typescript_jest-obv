import {Rule} from 'Event/attendee-rules'
import styled from 'styled-components'
import GroupRuleLabel, {
  GROUP,
} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import ConditionSelector from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/ConditionSelector'
import {TAGS} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import NestedRuleLabel from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import TagsRuleLabel from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {NESTED_RULE} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/NestedRule'

export default function SingleRule(props: {
  rule: Rule
  isFirstRule: boolean
  className?: string
  onEdit: () => void
  onUpdate: (rule: Rule) => void
}) {
  const updateCondition = (condition: Rule['condition']) => {
    props.onUpdate({
      ...props.rule,
      condition,
    })
  }

  return (
    <Box className={props.className}>
      <StyledConditionSelector
        visible={!props.isFirstRule}
        onSelect={updateCondition}
        rule={props.rule}
      />
      <Content onClick={props.onEdit}>
        <RuleValue rule={props.rule} />
      </Content>
    </Box>
  )
}

function RuleValue(props: {rule: Rule}) {
  switch (props.rule.source) {
    case TAGS:
      return <TagsRuleLabel rule={props.rule} />
    case GROUP:
      return <GroupRuleLabel rule={props.rule} />
    case NESTED_RULE:
      return <NestedRuleLabel rule={props.rule} />
  }
}

const Box = styled.div`
  display: flex;
`

const Content = styled.div`
  flex: 1;
  padding: ${(props) => `${props.theme.spacing[2]} ${props.theme.spacing[4]}`};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${grey[100]};
  }
`

const StyledConditionSelector = styled(ConditionSelector)`
  margin-right: ${(props) => props.theme.spacing[2]}!important;
`
