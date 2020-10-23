import {TagsRule as Rule} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import React from 'react'

export default function TagsRule(props: {rule: Rule}) {
  return (
    <div>
      Tags {props.rule.type} {props.rule.target}
    </div>
  )
}
