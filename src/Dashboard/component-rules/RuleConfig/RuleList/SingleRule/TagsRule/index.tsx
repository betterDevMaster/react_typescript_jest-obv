import React from 'react'

import {TagsRule as Rule} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule/tags-rule'

export default function TagsRule(props: {rule: Rule}) {
  return (
    <div>
      tags {props.rule.type} {props.rule.target}
    </div>
  )
}
