import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import faker from 'faker'
import {fakeMainNavButton} from 'Dashboard/components/MainNavButton/__utils__/factory'
import {pipe} from 'ramda'
import {fakeAgenda} from 'Dashboard/components/AgendaList/__utils__/factory'
import {ALL_EMOJIS} from 'Dashboard/components/EmojiList/emoji'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import {fakeResource} from 'Dashboard/components/ResourceList/__utils__/factory'
import {sometimes} from '__utils__/attributes'
import {fakeTicketRibbon} from 'Dashboard/components/TicketRibbon/__utils__/factory'

export const fakeSimpleBlog = (
  overrides?: Partial<SimpleBlogDashboard>,
): SimpleBlogDashboard => {
  const defaultAttributes: SimpleBlogDashboard = {
    template: SIMPLE_BLOG,
    title: faker.company.companyName(),
    logo: 'https://tax.live/success_summit/images/virtual-2020-logo.png',
    welcomeText: 'WELCOME TO THE DASHBOARD',
    primaryColor: '#14aecf',
    sidebar: {
      background: '#000000',
      textColor: '#FFFFFF',
    },
    ticketRibbon: null,
    mainNavButtons: [],
    emojis: [],
    blogPosts: [],
    agendas: [],
    points: null,
    resourceList: {
      description: '',
      resources: [],
    },
  }

  const attributes = pipe(
    withMainNavButtons,
    withEmojis,
    withAgendas,
    sometimes<SimpleBlogDashboard>(withTicketRibbon),
    sometimes<SimpleBlogDashboard>(withPoints),
    sometimes<SimpleBlogDashboard>(withResources),
  )(defaultAttributes)

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
  return {
    ...attributes,
    points: fakePoints(),
  }
}

function withResources(attributes: SimpleBlogDashboard) {
  return {
    ...attributes,
    resourceList: {
      description: faker.lorem.paragraph(),
      resources: Array.from(
        {length: faker.random.number({min: 1, max: 6})},
        fakeResource,
      ),
    },
  }
}

function withTicketRibbon(attributes: SimpleBlogDashboard) {
  return {
    ...attributes,
    ticketRibbon: fakeTicketRibbon(),
  }
}
