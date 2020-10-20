import {BaseRule} from 'Dashboard/rule'

export const TAGS = 'TAGS'
export const INCLUDES = 'INCLUDES'
export const DOES_NOT_INCLUDE = 'DOES NOT INCLUDE'
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
