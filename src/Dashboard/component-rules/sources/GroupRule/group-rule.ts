import {AND, BaseRule} from 'Dashboard/component-rules/sources'

export const GROUP = 'Group'
export const IS = 'is'
export const IS_NOT = 'is not'
export type GroupRule = BaseRule & {
  source: typeof GROUP
  type: typeof IS | typeof IS_NOT
  key: string
  target: string
}

export type Groups = Record<string, any>

export function meetsGroupRule(groups: Groups, rule: GroupRule) {
  if (rule.type === IS_NOT) {
    return groups[rule.key] !== rule.target
  }

  return groups[rule.key] === rule.target
}

export const createGroupRule = (
  type: GroupRule['type'],
  key: GroupRule['key'],
  target: GroupRule['target'],
): GroupRule => ({
  condition: AND,
  source: GROUP,
  type,
  key,
  target,
})
