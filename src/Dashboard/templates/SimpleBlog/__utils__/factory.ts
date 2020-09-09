import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import faker from 'faker'
import {fakeMainNavButton} from 'Dashboard/components/MainNavButton/__utils__/factory'
import {pipe} from 'ramda'
import {fakeAgenda} from 'Dashboard/components/AgendaList/__utils__/factory'
import {ALL_EMOJIS} from 'Dashboard/components/EmojiList/emoji'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'

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
      textColor: '#FFFFFF',
    },
    mainNavButtons: [],
    emojis: [],
    blogPosts: [],
    agendas: [],
    points: null,
  }

  const attributes = pipe(
    withMainNavButtons,
    withEmojis,
    withAgendas,
    withPoints,
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
      faker.random.arrayElement(ALL_EMOJIS),
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

function withPoints(attributes: SimpleBlogDashboard) {
  if (faker.random.boolean()) {
    return attributes
  }

  return {
    ...attributes,
    points: fakePoints(),
  }
}
