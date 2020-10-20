import {GroupRule} from 'Dashboard/rule/group'
import {TagsRule} from 'Dashboard/rule/tags'
import {
  GROUP,
  Groups,
  meetsGroupRule as matchesGroupRule,
} from 'Dashboard/rule/group'
import {meetsTagsRule as matchesTagsRule, TAGS, Tags} from 'Dashboard/rule/tags'

export type Rule = TagsRule | GroupRule | NestedRule
export interface HasRules {
  rules: Rule[]
}

export const AND = 'AND'
export const OR = 'OR'
export type Condition = typeof AND | typeof OR

export type BaseRule = {
  condition: Condition
}

export const NESTED_RULE = 'NESTED RULE'
type NestedRule = BaseRule & {
  source: typeof NESTED_RULE
  rules: Rule[]
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
