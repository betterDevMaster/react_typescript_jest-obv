import {GroupRule} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import {NestedRule} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import {TagsRule} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule/tags-rule'

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
