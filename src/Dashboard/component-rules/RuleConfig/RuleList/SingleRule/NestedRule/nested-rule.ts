import {AND, BaseRule, Rule} from 'Dashboard/component-rules'

export const NESTED_RULE = 'Nested Rule'
export type NestedRule = BaseRule & {
  source: typeof NESTED_RULE
  rules: Rule[]
}

export const createNestedRule = (rules: Rule[]): NestedRule => ({
  condition: AND,
  source: NESTED_RULE,
  rules,
})
