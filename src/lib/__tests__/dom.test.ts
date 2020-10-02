import faker from 'faker'
import {findWithText} from 'lib/dom'

it('should return the html element', () => {
  const targetText = faker.random.word()

  const target = document.createElement('BUTTON')
  target.textContent = targetText

  const otherElements = Array.from(
    {length: faker.random.number({min: 1, max: 10})},
    () => {
      const el = document.createElement('INPUT')

      el.textContent = faker.random.word()
      return el
    },
  )

  const elements = [...otherElements, target]

  expect(findWithText(targetText)(elements)?.textContent).toBe(
    target.textContent,
  )

  expect(findWithText(new RegExp(targetText))(elements)?.textContent).toBe(
    target.textContent,
  )

  expect(findWithText(targetText)(otherElements)).toBe(undefined)
})
