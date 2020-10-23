import React from 'react'
import {Rule} from 'Dashboard/component-rules/sources'
import {GROUP} from 'Dashboard/component-rules/sources/GroupRule/group-rule'
import TagsRuleConfig from 'Dashboard/component-rules/sources/TagsRule/TagsRuleConfig'
import GroupRuleConfig from 'Dashboard/component-rules/sources/GroupRule/GroupRuleConfig'
import NestedRuleConfig from 'Dashboard/component-rules/sources/NestedRule/NestedRuleConfig'
import {TAGS} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import {NESTED_RULE} from 'Dashboard/component-rules/sources/NestedRule/nested-rule'

export type RuleConfigProps = {
  onSet: (rule: Rule | null) => void
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
      return <TagsRuleConfig onSet={props.onSet} />
    case GROUP:
      return <GroupRuleConfig onSet={props.onSet} />
    case NESTED_RULE:
      return <NestedRuleConfig onSet={props.onSet} />
  }
}
