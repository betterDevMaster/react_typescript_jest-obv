import {GroupRule} from 'Dashboard/rule/group'
import {TagsRule} from 'Dashboard/rule/tags'
import {GROUP, Groups, meetsGroupRule} from 'Dashboard/rule/group'
import {meetsTagsRule, TAGS, Tags} from 'Dashboard/rule/tags'

export const AND = 'AND'
export const OR = 'OR'
export type Operator = typeof AND | typeof OR

export type BaseRule = {
  operator: Operator
}

export const NESTED_RULE = 'NESTED RULE'
type NestedRule = BaseRule & {
  source: typeof NESTED_RULE
  rules: Rule[]
}

export type Rule = TagsRule | GroupRule | NestedRule

export const hasMatch = (
  {groups = {}, tags = []}: {groups?: Groups; tags?: Tags},
  rules: Rule[],
): boolean =>
  rules.reduce((alreadyMatched: boolean, r: Rule, i: number) => {
    const isMatch = isTrue(groups, tags, r)
    switch (r.operator) {
      case AND:
        const isFirst = i === 0
        return isFirst ? isMatch : alreadyMatched && isMatch
      case OR:
        return alreadyMatched || isMatch
      default:
        throw new Error(`Unimplemented rule operator: ${r.operator}`)
    }
  }, false)

function isTrue(groups: Groups, tags: Tags, r: Rule) {
  switch (r.source) {
    case NESTED_RULE:
      return hasMatch({groups, tags}, r.rules)
    case GROUP:
      return meetsGroupRule(groups, r)
    case TAGS:
      return meetsTagsRule(tags, r)
  }
}
