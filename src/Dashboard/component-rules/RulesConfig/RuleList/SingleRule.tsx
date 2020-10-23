import {Rule} from 'Dashboard/component-rules/sources'
import GroupRule from 'Dashboard/component-rules/sources/GroupRule'
import {GROUP} from 'Dashboard/component-rules/sources/GroupRule/group-rule'
import NestedRule from 'Dashboard/component-rules/sources/NestedRule'
import {NESTED_RULE} from 'Dashboard/component-rules/sources/NestedRule/nested-rule'
import TagsRule from 'Dashboard/component-rules/sources/TagsRule'
import {TAGS} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import React from 'react'

export default function SingleRule(props: {rule: Rule}) {
  switch (props.rule.source) {
    case TAGS:
      return <TagsRule rule={props.rule} />
    case GROUP:
      return <GroupRule rule={props.rule} />
    case NESTED_RULE:
      return <NestedRule rule={props.rule} />
  }
}
