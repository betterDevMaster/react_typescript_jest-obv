import {NavButtonWithSize, NavButton} from 'Dashboard/components/NavButton'
import faker from 'faker'
import {Column} from 'ui/layout'

export const fakeNavButtonWithSize = (): NavButtonWithSize => ({
  text: faker.lorem.word(),
  link: faker.internet.url(),
  size: faker.random.boolean()
    ? (faker.random.number({min: 3, max: 12}) as Column)
    : 12,
})

export function withMainNavButtons<T extends {mainNavButtons: NavButton[]}>(
  attributes: T,
): T {
  return {
    ...attributes,
    mainNavButtons: Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      fakeNavButtonWithSize,
    ),
  }
}
