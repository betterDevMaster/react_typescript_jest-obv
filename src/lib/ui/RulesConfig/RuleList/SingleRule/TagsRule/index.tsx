import {AND, BaseRule} from 'lib/ui/RulesConfig'
import React from 'react'

export const TAGS = 'Tags'
export const INCLUDE = 'include'
export const DOES_NOT_INCLUDE = 'does not include'

export type TagsRuleConfig = BaseRule & {
  source: typeof TAGS
  type: typeof INCLUDE | typeof DOES_NOT_INCLUDE
  target: string
}

export default function TagsRule(props: {rule: TagsRuleConfig}) {
  return (
    <div>
      tags {props.rule.type} {props.rule.target}
    </div>
  )
}

export const createTagsRule = (
  type: TagsRuleConfig['type'],
  target: string,
): TagsRuleConfig => ({
  condition: AND,
  source: TAGS,
  type,
  target,
})
