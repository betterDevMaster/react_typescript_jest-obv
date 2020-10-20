import {AND, hasMatch} from 'Dashboard/rule'
import {DOES_NOT_INCLUDE, INCLUDES, TAGS, TagsRule} from 'Dashboard/rule/tags'
import faker from 'faker'

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
    operator: AND,
    source: TAGS,
    type: INCLUDES,
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
    operator: AND,
    source: TAGS,
    type: DOES_NOT_INCLUDE,
    target: tag,
  }

  expect(hasMatch({tags}, [rule])).toBe(true)
})
