import {AND, BaseRule} from 'Dashboard/component-rules/sources'

export const TAGS = 'Tags'
export const INCLUDES = 'includes'
export const DOES_NOT_INCLUDE = 'does not include'

export type TagsRule = BaseRule & {
  source: typeof TAGS
  type: typeof INCLUDES | typeof DOES_NOT_INCLUDE
  target: string
}

export type Tags = string[]

export function meetsTagsRule(tags: Tags, rule: TagsRule) {
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
