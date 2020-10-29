import {AND, BaseRule} from 'Dashboard/component-rules'

export const TAGS = 'Tags'
export const INCLUDE = 'include'
export const DOES_NOT_INCLUDE = 'does not include'

export type TagsRule = BaseRule & {
  source: typeof TAGS
  type: typeof INCLUDE | typeof DOES_NOT_INCLUDE
  target: string
}

export type Tags = string[]

export function matchesTagsRule(tags: Tags, rule: TagsRule) {
  if (rule.type === DOES_NOT_INCLUDE) {
    return !tags.includes(rule.target)
  }

  return tags.includes(rule.target)
}

export const createTagsRule = (
  type: TagsRule['type'],
  target: string,
): TagsRule => ({
  condition: AND,
  source: TAGS,
  type,
  target,
})
