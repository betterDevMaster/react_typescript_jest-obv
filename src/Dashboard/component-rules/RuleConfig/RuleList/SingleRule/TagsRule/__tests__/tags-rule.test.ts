import {AND} from 'Dashboard/component-rules'
import {
  INCLUDE,
  DOES_NOT_INCLUDE,
  TAGS,
  TagsRule,
} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule/tags-rule'
import faker from 'faker'
import {hasMatch} from 'Dashboard/component-rules/matcher'

it('should check for includes', () => {
  const tag = faker.random.word()

  const tags = [
    ...Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      faker.random.word,
    ),
    tag,
  ]

  const rule: TagsRule = {
    condition: AND,
    source: TAGS,
    type: INCLUDE,
    target: tag,
  }

  expect(hasMatch({tags}, [rule])).toBe(true)
})

it('should check for doese not include', () => {
  const tag = faker.random.word()

  const tags = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    faker.random.word,
  )

  const rule: TagsRule = {
    condition: AND,
    source: TAGS,
    type: DOES_NOT_INCLUDE,
    target: tag,
  }

  expect(hasMatch({tags}, [rule])).toBe(true)
})
