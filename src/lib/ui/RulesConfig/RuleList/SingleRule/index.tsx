import {Rule} from 'lib/ui/RulesConfig'
import styled from 'styled-components'
import GroupRule, {
  GROUP,
} from 'lib/ui/RulesConfig/RuleList/SingleRule/GroupRule'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import ConditionSelector from 'lib/ui/RulesConfig/RuleList/SingleRule/ConditionSelector'
import {TAGS} from 'lib/ui/RulesConfig/RuleList/SingleRule/TagsRule'
import NestedRule from 'lib/ui/RulesConfig/RuleList/SingleRule/NestedRule'
import TagsRule from 'lib/ui/RulesConfig/RuleList/SingleRule/TagsRule'
import {NESTED_RULE} from 'lib/ui/RulesConfig/RuleList/SingleRule/NestedRule'
import Grid from '@material-ui/core/Grid'

export default function SingleRule(props: {
  rule: Rule
  isFirstRule: boolean
  className?: string
  nestedDeep: number
}) {
  return (
    <>
      <Grid>
        <StyledConditionSelector
          visible={!props.isFirstRule}
          rule={props.rule}
        />
      </Grid>
      <Grid>
        <Content>
          <RuleValue rule={props.rule} nestedDeep={props.nestedDeep} />
        </Content>
      </Grid>
    </>
  )
}

function RuleValue(props: {rule: Rule; nestedDeep: number}) {
  switch (props.rule.source) {
    case TAGS:
      return <TagsRule rule={props.rule} />
    case GROUP:
      return <GroupRule rule={props.rule} />
    case NESTED_RULE:
      return <NestedRule rule={props.rule} nestedDeep={props.nestedDeep} />
  }
}

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
