import {
  NavButtonProps,
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import faker from 'faker'
import {pipe} from 'ramda'
import {Column} from 'lib/ui/layout'
import {sometimes} from '__utils__/attributes'

export const fakeNavButton = (
  overrides?: Partial<NavButtonProps>,
): NavButtonProps => {
  const defaultAttributes: NavButtonProps = {
    text: `${faker.random.words(3)}`,
    link: faker.internet.url(),
    newTab: false,
    rules: [],
    isAreaButton: false,
    isImageUpload: false,
    areaId: null,
    actionId: null,
    isVisible: true,
    infusionsoftTag: null,
    mailchimpTag: null,
    zapierTag: null,
  }

  const makeAttributes: (nb: NavButtonProps) => NavButtonProps = pipe(
    sometimes<NavButtonProps>(withHoverBackground),
    sometimes<NavButtonProps>(withBorderRadius),
    sometimes<NavButtonProps>(withBorder),
    sometimes<NavButtonProps>(withHoverBorderColor),
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

function withHoverBackground(button: NavButtonProps): NavButtonProps {
  return {
    ...button,
    hoverBackgroundColor: faker.internet.color(),
  }
}

function withBorderRadius(button: NavButtonProps): NavButtonProps {
  return {
    ...button,
    borderRadius: faker.random.number({min: 0, max: 10}),
  }
}

function withBorder(button: NavButtonProps): NavButtonProps {
  return {
    ...button,
    borderWidth: faker.random.number({min: 1, max: 5}),
    borderColor: faker.internet.color(),
  }
}

function withHoverBorderColor(button: NavButtonProps): NavButtonProps {
  return {
    ...button,
    hoverBorderColor: faker.internet.color(),
  }
}
