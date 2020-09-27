import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import faker from 'faker'
import {withMainNavButtons} from 'Dashboard/component/NavButton/__utils__/factory'
import {pipe} from 'ramda'
import {withAgendas} from 'Dashboard/component/AgendaList/__utils__/factory'
import {withPoints} from 'Dashboard/component/PointsSummary/__utils__/factory'
import {withResources} from 'Dashboard/component/ResourceList/__utils__/factory'
import {sometimes} from '__utils__/attributes'
import {withTicketRibbon} from 'Dashboard/component/TicketRibbon/__utils__/factory'
import {withEmojiList} from 'Dashboard/component/EmojiList/__utils__/factory'
import {withBlogPosts} from 'Dashboard/component/BlogPost/__utils__/factory'

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
      navButtons: [],
    },
    ticketRibbon: null,
    mainNavButtons: [],
    emojiList: null,
    blogPosts: [],
    agendas: [],
    points: null,
    resourceList: {
      description: '',
      resources: [],
    },
    footer: {
      background: '#000000',
      textColor: '#ffffff',
      termsLink: faker.random.boolean() ? faker.internet.url() : null,
      privacyLink: faker.random.boolean() ? faker.internet.url() : null,
      copyrightText: faker.random.boolean()
        ? `© 2020 ${faker.company.companyName()}. All Rights Reserved.`
        : null,
    },
  }

  const makeAttributes: (d: SimpleBlogDashboard) => SimpleBlogDashboard = pipe(
    withAgendas,
    withMainNavButtons,
    withTicketRibbon,
    withBlogPosts,
    sometimes<SimpleBlogDashboard>(withPoints),
    sometimes<SimpleBlogDashboard>(withResources),
    sometimes<SimpleBlogDashboard>(withEmojiList),
  )

  return {
    ...makeAttributes(defaultAttributes),
    ...overrides,
  }
}
