import {GroupRule} from 'Dashboard/component-rules/sources/GroupRule/group-rule'
import {TagsRule} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import {
  GROUP,
  Groups,
  meetsGroupRule as matchesGroupRule,
} from 'Dashboard/component-rules/sources/GroupRule/group-rule'
import {
  meetsTagsRule as matchesTagsRule,
  TAGS,
  Tags,
} from 'Dashboard/component-rules/sources/TagsRule/tags-rule'
import {
  NestedRule,
  NESTED_RULE,
} from 'Dashboard/component-rules/sources/NestedRule/nested-rule'

export type Rule = TagsRule | GroupRule | NestedRule
export interface HasRules {
  rules: Rule[]
}

export const AND = 'And'
export const OR = 'Or'
export type Condition = typeof AND | typeof OR

export type BaseRule = {
  condition: Condition
}

export const hasMatch = (
  {groups = {}, tags = []}: {groups?: Groups; tags?: Tags},
  rules: Rule[],
): boolean =>
  rules.reduce((alreadyMatched: boolean, r: Rule, i: number) => {
    const isMatch = isTrue(groups, tags, r)
    switch (r.condition) {
      case AND:
        const isFirst = i === 0
        return isFirst ? isMatch : alreadyMatched && isMatch
      case OR:
        return alreadyMatched || isMatch
      default:
        throw new Error(`Unimplemented rule operator: ${r.condition}`)
    }
  }, false)

function isTrue(groups: Groups, tags: Tags, r: Rule) {
  switch (r.source) {
    case NESTED_RULE:
      return hasMatch({groups, tags}, r.rules)
    case GROUP:
      return matchesGroupRule(groups, r)
    case TAGS:
      return matchesTagsRule(tags, r)
  }
}
