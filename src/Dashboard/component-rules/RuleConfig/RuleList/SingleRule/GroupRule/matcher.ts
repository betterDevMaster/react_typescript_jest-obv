import {AND} from 'Dashboard/component-rules'
import {
  Groups,
  GroupRule,
  GROUP,
  IS_NOT,
} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'

export function matchesGroupRule(groups: Groups, rule: GroupRule) {
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
