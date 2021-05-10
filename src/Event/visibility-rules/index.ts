import {GroupRule} from 'Event/visibility-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import {NestedRule} from 'Event/visibility-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import {TagsRule} from 'Event/visibility-rules/RuleConfig/RuleList/SingleRule/TagsRule'

export type Rule = TagsRule | GroupRule | NestedRule
export interface HasRules {
  rules?: Rule[]
}

export const AND = 'And'
export const OR = 'Or'
export type Condition = typeof AND | typeof OR

export type BaseRule = {
  condition: Condition
}
