import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import faker from 'faker'
import {withMainNavButtons} from 'Dashboard/components/MainNavButton/__utils__/factory'
import {compose} from 'ramda'
import {withAgendas} from 'Dashboard/components/AgendaList/__utils__/factory'
import {withPoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import {withResources} from 'Dashboard/components/ResourceList/__utils__/factory'
import {sometimes} from '__utils__/attributes'
import {withTicketRibbon} from 'Dashboard/components/TicketRibbon/__utils__/factory'
import {withEmojis} from 'Dashboard/components/EmojiList/__utils__/factory'

type D = SimpleBlogDashboard

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

  const attributes = compose(
    (d: D) => withAgendas<D>(d),
    (d: D) => withEmojis<D>(d),
    (d: D) => withMainNavButtons<D>(d),
    (d: D) => withTicketRibbon<D>(d),
    sometimes<D>(withPoints),
    sometimes<D>(withResources),
  )(defaultAttributes)

  return {
    ...attributes,
    ...overrides,
  }
}
