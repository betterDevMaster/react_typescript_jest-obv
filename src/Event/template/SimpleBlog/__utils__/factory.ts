import faker from 'faker'
import {pipe} from 'ramda'
import {withAgendas} from 'Event/Dashboard/components/AgendaList/__utils__/factory'
import {withPoints} from 'Event/Dashboard/components/PointsSummary/__utils__/factory'
import {withResources} from 'Event/Dashboard/components/ResourceList/__utils__/factory'
import {sometimes} from '__utils__/attributes'
import {withTicketRibbons} from 'Event/Dashboard/components/TicketRibbonList/__utils__/factory'
import {withEmojiList} from 'Event/Dashboard/components/EmojiList/__utils__/factory'
import {withBlogPosts} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import {
  fakeNavButton,
  fakeNavButtonWithSize,
} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {SimpleBlog, SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {colors} from 'lib/ui/theme'

export const fakeSimpleBlog = (overrides?: Partial<SimpleBlog>): SimpleBlog => {
  const defaultAttributes: SimpleBlog = {
    version: 1,
    name: SIMPLE_BLOG,
    title: faker.company.companyName(),
    sidebar: fakeSideBarContainer(),
    sidebarNav: {entities: {}, ids: []},
    techCheck: {
      buttonText: 'submit',
      buttonBackground: 'blue',
      buttonTextColor: '#ffffff',
      buttonBorderRadius: 0,
      buttonBorderWidth: 0,
      buttonBorderColor: '#ffffff',
      buttonWidth: 12,
    },
    ticketRibbons: [],
    mainNav: {entities: {}, ids: []},
    emojiList: {emojis: []},
    blogPosts: {entities: {}, ids: []},
    welcomeText: 'WELCOME TO YOUR DASHBOARD',
    agenda: {
      title: 'Agenda',
      items: [],
    },
    points: null,
    resourceList: {
      title: 'Resources',
      description: '',
      resources: [],
    },
    backgroundPosition: 'fixed',
    header: {
      backgroundColor: '#FFFFFF',
      backgroundOpacity: 1,
      height: 50,
      script: null,
      isCollapsed: false,
      disableShadow: false,
    },
    footer: {
      background: '#000000',
      textColor: '#ffffff',
      imageSize: 100,
      termsLink: faker.random.boolean() ? faker.internet.url() : null,
      privacyLink: faker.random.boolean() ? faker.internet.url() : null,
      copyrightText: faker.random.boolean()
        ? `© 2020 ${faker.company.companyName()}. All Rights Reserved.`
        : null,
    },
    progressBar: {
      barColor: '#000000',
      textColor: '#ffffff',
      thickness: 15,
      borderRadius: 50,
    },
    menu: {
      backgroundColor: '#000000',
      iconColor: '#0969d6',
      textColor: '#FFFFFF',
    },
    login: {
      submitButton: {
        backgroundColor: colors.primary,
        textColor: '#FFFFFF',
        label: 'Login',
      },
      description: {
        text: '',
        color: '#000000',
        fontSize: 18,
      },
      logoSize: 100,
    },
    leaderboard: {
      title: 'Leaderboard',
      description: '',
      backToDashboardText: 'Back to Dashboard',
      backToDashboardTextColor: '#000000',
    },
    zoomBackgrounds: {
      borderColor: '#000000',
      borderRadius: 0,
      borderThickness: 0,
      imagesPerRow: 2,
      description: {
        color: '#000000',
        fontSize: 18,
      },
      backToDashboardText: 'Back to Dashboard',
      backToDashboardTextColor: '#000000',
    },
  }

  const makeAttributes: (d: SimpleBlog) => SimpleBlog = pipe(
    withAgendas,
    withMainNav,
    withSidebarNav,
    withTicketRibbons,
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

export function fakeLogin(
  overrides?: Partial<SimpleBlog['login']>,
): SimpleBlog['login'] {
  return {
    submitButton: {
      backgroundColor: colors.primary,
      textColor: '#FFFFFF',
      label: 'Login',
    },
    description: {
      text: '',
      color: '#000000',
      fontSize: 18,
    },
    logoSize: 100,
    ...overrides,
  }
}

export function fakeHeader(
  overrides?: Partial<SimpleBlog['header']>,
): SimpleBlog['header'] {
  return {
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 1,
    height: 50,
    script: null,
    isCollapsed: false,
    disableShadow: false,
    ...overrides,
  }
}

export function fakeTemplateTechCheck(
  overrides?: Partial<SimpleBlog['techCheck']>,
): SimpleBlog['techCheck'] {
  return {
    buttonText: 'submit',
    buttonBackground: 'blue',
    buttonTextColor: '#ffffff',
    buttonBorderRadius: 0,
    buttonBorderWidth: 0,
    buttonBorderColor: '#ffffff',
    buttonWidth: 12,
    ...overrides,
  }
}

export function fakeSideBarContainer(
  overrides?: Partial<SimpleBlog['sidebar']>,
): SimpleBlog['sidebar'] {
  return {
    background: '#000000',
    textColor: '#FFFFFF',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#000000',
    paddingTop: 0,
    isVisible: true,
    ...overrides,
  }
}

export function fakeZoomBackgrounds(
  overrides?: Partial<SimpleBlog['zoomBackgrounds']>,
): SimpleBlog['zoomBackgrounds'] {
  return {
    borderColor: '#000000',
    borderRadius: 0,
    borderThickness: 0,
    imagesPerRow: 2,
    description: {
      color: '#000000',
      fontSize: 18,
    },
    backToDashboardText: 'Back to Dashboard',
    backToDashboardTextColor: '#000000',
    ...overrides,
  }
}
