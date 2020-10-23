import {BaseRule, Rule} from 'Dashboard/component-rules/sources'

export const NESTED_RULE = 'Nested Rule'
export type NestedRule = BaseRule & {
  source: typeof NESTED_RULE
  rules: Rule[]
}
