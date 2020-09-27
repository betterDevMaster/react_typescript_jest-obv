import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import faker from 'faker'
import {withMainNavButtons} from 'Dashboard/components/NavButton/__utils__/factory'
import {pipe} from 'ramda'
import {withAgendas} from 'Dashboard/components/AgendaList/__utils__/factory'
import {withPoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import {withResources} from 'Dashboard/components/ResourceList/__utils__/factory'
import {sometimes} from '__utils__/attributes'
import {withTicketRibbon} from 'Dashboard/components/TicketRibbon/__utils__/factory'
import {withEmojiList} from 'Dashboard/components/EmojiList/__utils__/factory'
import {withBlogPosts} from 'Dashboard/components/BlogPost/__utils__/factory'

export const fakeSimpleBlog = (
  overrides?: Partial<SimpleBlogDashboard>,
): SimpleBlogDashboard => {
  const defaultAttributes: SimpleBlogDashboard = {
    template: SIMPLE_BLOG,
    title: faker.company.companyName(),
    logo: 'https://tax.live/success_summit/images/virtual-2020-logo.png',
    welcomeText: 'WELCOME TO THE DASHBOARD',
    primaryColor: '#14aecf',
    sidebarBackground: '#000000',
    sidebarTextColor: '#FFFFFF',
    sidebarNavButtons: [],
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
    footerBackground: '#000000',
    footerTextColor: '#ffffff',
    footerTermsLink: faker.random.boolean() ? faker.internet.url() : null,
    footerPrivacyLink: faker.random.boolean() ? faker.internet.url() : null,
    footerCopyrightText: faker.random.boolean()
      ? `© 2020 ${faker.company.companyName()}. All Rights Reserved.`
      : null,
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
