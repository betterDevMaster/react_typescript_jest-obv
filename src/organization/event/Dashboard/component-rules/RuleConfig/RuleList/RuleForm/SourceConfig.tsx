import React from 'react'
import {Rule} from 'organization/event/Dashboard/component-rules'
import GroupRuleConfig from 'organization/event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule/GroupRuleConfig'
import {TAGS} from 'organization/event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import TagsRuleConfig from 'organization/event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule/TagsRuleConfig'
import {NESTED_RULE} from 'organization/event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import NestedRuleConfig from 'organization/event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule/NestedRuleConfig'
import {GROUP} from 'organization/event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'

export type RuleConfigProps = {
  onSet: (rule: Rule | null) => void
  rule: Rule | null
  onToggleNestedRule?: () => void
}

export default function SourceConfig(
  props: RuleConfigProps & {
    source: Rule['source'] | null
  },
) {
  if (!props.source) {
    return null
  }

  switch (props.source) {
    case TAGS:
      return <TagsRuleConfig rule={props.rule} onSet={props.onSet} />
    case GROUP:
      return <GroupRuleConfig rule={props.rule} onSet={props.onSet} />
    case NESTED_RULE:
      return (
        <NestedRuleConfig
          rule={props.rule}
          onSet={props.onSet}
          onToggleNestedRule={props.onToggleNestedRule}
        />
      )
  }
}
