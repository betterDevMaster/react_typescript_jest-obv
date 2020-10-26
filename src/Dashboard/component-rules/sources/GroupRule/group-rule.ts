import {BaseRule} from 'Dashboard/component-rules/sources'

export const GROUP = 'Group'
export const IS_MATCH = 'Is Match'
export const DOES_NOT_MATCH = 'Does Not Match'
export type GroupRule = BaseRule & {
  source: typeof GROUP
  type: typeof IS_MATCH | typeof DOES_NOT_MATCH
  key: string
  target: string
}

export type Groups = Record<string, any>

export function meetsGroupRule(groups: Groups, rule: GroupRule) {
  if (rule.type === DOES_NOT_MATCH) {
    return groups[rule.key] !== rule.target
  }

  return groups[rule.key] === rule.target
}
