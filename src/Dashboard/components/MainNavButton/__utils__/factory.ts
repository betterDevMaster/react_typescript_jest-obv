import MainNavButton from 'Dashboard/components/MainNavButton'
import faker from 'faker'
import {Column} from 'ui/layout'

export const fakeMainNavButton = (): MainNavButton => ({
  text: faker.lorem.word(),
  link: faker.internet.url(),
  size: faker.random.boolean()
    ? (faker.random.number({min: 3, max: 12}) as Column)
    : 12,
})

export function withMainNavButtons<T>(attributes: T): T {
  return {
    ...attributes,
    mainNavButtons: Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      fakeMainNavButton,
    ),
  }
}
