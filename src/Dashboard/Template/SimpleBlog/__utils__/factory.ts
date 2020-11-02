import {SimpleBlog, SIMPLE_BLOG} from 'Dashboard/Template/SimpleBlog'
import faker from 'faker'
import {pipe} from 'ramda'
import {withAgendas} from 'Dashboard/components/AgendaList/__utils__/factory'
import {withPoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import {withResources} from 'Dashboard/components/ResourceList/__utils__/factory'
import {sometimes} from '__utils__/attributes'
import {withTicketRibbon} from 'Dashboard/components/TicketRibbon/__utils__/factory'
import {withEmojiList} from 'Dashboard/components/EmojiList/__utils__/factory'
import {withBlogPosts} from 'Dashboard/components/BlogPost/__utils__/factory'
import {
  fakeNavButton,
  fakeNavButtonWithSize,
} from 'Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'

export const fakeSimpleBlog = (overrides?: Partial<SimpleBlog>): SimpleBlog => {
  const defaultAttributes: SimpleBlog = {
    template: SIMPLE_BLOG,
    title: faker.company.companyName(),
    logo: 'https://tax.live/success_summit/images/virtual-2020-logo.png',
    welcomeText: 'WELCOME TO THE DASHBOARD',
    primaryColor: '#14aecf',
    sidebar: {
      background: '#000000',
      textColor: '#FFFFFF',
    },
    sidebarNav: {entities: {}, ids: []},
    ticketRibbon: null,
    mainNav: {entities: {}, ids: []},
    emojiList: {emojis: []},
    blogPosts: {entities: {}, ids: []},
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

  const makeAttributes: (d: SimpleBlog) => SimpleBlog = pipe(
    withAgendas,
    withMainNav,
    withSidebarNav,
    withTicketRibbon,
    withBlogPosts,
    sometimes<SimpleBlog>(withPoints),
    sometimes<SimpleBlog>(withResources),
    sometimes<SimpleBlog>(withEmojiList),
  )

  return {
    ...makeAttributes(defaultAttributes),
    ...overrides,
  }
}

export function withMainNav<T extends {mainNav: SimpleBlog['mainNav']}>(
  attributes: T,
): T {
  const buttons = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeNavButtonWithSize,
  )
  return {
    ...attributes,
    mainNav: createEntityList(buttons),
  }
}

export function withSidebarNav<
  T extends {sidebarNav: SimpleBlog['sidebarNav']}
>(attributes: T): T {
  const buttons = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () =>
      fakeNavButton({
        borderRadius: 0,
        hoverBorderColor: '#FFFFFF',
      }),
  )
  return {
    ...attributes,
    sidebarNav: createEntityList(buttons),
  }
}
