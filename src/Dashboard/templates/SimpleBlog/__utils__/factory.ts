import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import faker from 'faker'
import {fakeMainNavButton} from 'Dashboard/components/MainNavButton/__utils__/factory'
import * as ALL_EMOJIS from 'ui/system/emojis'
import {pipe} from 'ramda'
import {fakeAgenda} from 'Dashboard/components/AgendaList/__utils__/factory'

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
    emojis: [],
    blogPosts: [],
    agendas: [],
  }

  const attributes = pipe(
    withMainNavButtons,
    withEmojis,
    withAgendas,
  )(requiredAttributes)

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
  return {
    ...attributes,
    emojis: Array.from({length: faker.random.number({min: 0, max: 5})}, () =>
      faker.random.arrayElement(emojis),
    ),
  }
}

function withAgendas(attributes: SimpleBlogDashboard) {
  return {
    ...attributes,
    agendas: Array.from(
      {length: faker.random.number({min: 0, max: 4})},
      fakeAgenda,
    ),
  }
}
