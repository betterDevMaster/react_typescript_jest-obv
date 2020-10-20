import {BaseRule} from 'Dashboard/rule'

export const GROUP = 'GROUP'
export const IS_MATCH = 'IS MATCH'
export const DOES_NOT_MATCH = 'DOES NOT MATCH'
export type GroupRule = BaseRule & {
  source: typeof GROUP
  type: typeof IS_MATCH | typeof DOES_NOT_MATCH
  key: string
  target: string
}

export type Groups = Record<string, string>

export function meetsGroupRule(groups: Groups, rule: GroupRule) {
  if (rule.type === DOES_NOT_MATCH) {
    return groups[rule.key] !== rule.target
  }

  return groups[rule.key] === rule.target
}
