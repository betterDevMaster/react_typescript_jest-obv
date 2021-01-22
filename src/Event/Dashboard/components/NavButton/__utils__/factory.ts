import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import faker from 'faker'
import {pipe} from 'ramda'
import {Column} from 'lib/ui/layout'
import {sometimes} from '__utils__/attributes'

export const fakeNavButton = (overrides?: Partial<NavButton>): NavButton => {
  const texts = [
    faker.random.word(),
    `${faker.random.word()} ${faker.random.word()}`,
    `${faker.random.word()} ${faker.random.word()} ${faker.random.word()}`,
  ]

  const defaultAttributes: NavButton = {
    text: faker.random.arrayElement(texts),
    link: faker.internet.url(),
    newTab: true,
    rules: [],
    isAreaButton: false,
    areaId: null,
  }

  const makeAttributes: (nb: NavButton) => NavButton = pipe(
    sometimes<NavButton>(withHoverBackground),
    sometimes<NavButton>(withBorderRadius),
    sometimes<NavButton>(withBorder),
    sometimes<NavButton>(withHoverBorderColor),
  )

  return {
    ...makeAttributes(defaultAttributes),
    ...overrides,
  }
}

export const fakeNavButtonWithSize = (
  overrides?: Partial<NavButtonWithSize>,
): NavButtonWithSize => ({
  ...fakeNavButton(),
  size: faker.random.boolean()
    ? (faker.random.number({min: 3, max: 12}) as Column)
    : 12,
  ...overrides,
})

function withHoverBackground(button: NavButton): NavButton {
  return {
    ...button,
    hoverBackgroundColor: faker.internet.color(),
  }
}

function withBorderRadius(button: NavButton): NavButton {
  return {
    ...button,
    borderRadius: faker.random.number({min: 0, max: 10}),
  }
}

function withBorder(button: NavButton): NavButton {
  return {
    ...button,
    borderWidth: faker.random.number({min: 1, max: 5}),
    borderColor: faker.internet.color(),
  }
}

function withHoverBorderColor(button: NavButton): NavButton {
  return {
    ...button,
    hoverBorderColor: faker.internet.color(),
  }
}
