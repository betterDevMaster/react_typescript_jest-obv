import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import faker from 'faker'
import {fakeMainNavButton} from 'Dashboard/components/MainNavButton/__utils__/factory'
import * as ALL_EMOJIS from 'ui/system/emojis'
import {pipe} from 'ramda'

const emojis = Object.values(ALL_EMOJIS)

export const fakeSimpleBlog = (
  overrides?: Partial<SimpleBlogDashboard>,
): SimpleBlogDashboard => {
  const requiredAttributes: SimpleBlogDashboard = {
    template: SIMPLE_BLOG,
    title: faker.company.companyName(),
    logo: 'https://tax.live/success_summit/images/virtual-2020-logo.png',
    welcomeText: 'WELCOME TO THE DASHBOARD',
    primaryColor: '#14aecf',
    sidebar: {
      background: '#000000',
    },
    mainNavButtons: [],
    emojis: null,
    blogPosts: [],
  }

  const attributes = pipe(withMainNavButtons, withEmojis)(requiredAttributes)

  return {
    ...attributes,
    ...overrides,
  }
}

function withMainNavButtons(attributes: SimpleBlogDashboard) {
  return {
    ...attributes,
    mainNavButtons: Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      fakeMainNavButton,
    ),
  }
}

function withEmojis(attributes: SimpleBlogDashboard) {
  const hasEmojis = faker.random.boolean()
  if (!hasEmojis) {
    return attributes
  }

  return {
    ...attributes,
    emojis: Array.from({length: faker.random.number({min: 1, max: 5})}, () =>
      faker.random.arrayElement(emojis),
    ),
  }
}
