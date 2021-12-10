import faker from 'faker'
import {pipe} from 'ramda'
import {withAgendas} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList/__utils__/factory'
import {withTicketRibbons} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/__utils__/factory'
import {withBlogPosts} from 'Event/Dashboard/components/BlogPosts/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createHashMap} from 'lib/list'
import {createCards, Cards} from 'Event/template/Cards'
import {colors} from 'lib/ui/theme'
export const fakeCards = (overrides?: Partial<Cards>): Cards => {
  const defaultAttributes: Cards = createCards()

  const makeAttributes: (d: Cards) => Cards = pipe(
    withAgendas,
    withMainNav,
    withTicketRibbons,
    withBlogPosts,
  )

  return {
    ...makeAttributes(defaultAttributes),
    ...overrides,
  }
}

export function withMainNav<T extends {mainNav: Cards['mainNav']}>(
  attributes: T,
): T {
  const buttons = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeNavButtonWithSize,
  )
  return {
    ...attributes,
    mainNav: createHashMap(buttons),
  }
}

export function fakeLogin(overrides?: Partial<Cards['login']>): Cards['login'] {
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
    additional_description: {
      text: '',
      color: '#000000',
      fontSize: 18,
    },
    welcome: {
      text: '',
      color: '#000000',
      fontSize: 18,
    },
    passwordReset: {
      iconName: 'lock',
      iconColor: 'blue',
      linkLabel: 'Forgot My Password?',
      buttonText: 'Submit',
      description: 'Please check your email once you submit.',
      successMessage: 'Success!',
      forgotPasswordTitle: 'Password Help',
    },
    logoSize: 100,
    ...overrides,
  }
}

export function fakeHeader(
  overrides?: Partial<Cards['header']>,
): Cards['header'] {
  return {
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 1,
    logoSize: 50,
    isCollapsed: false,
    ...overrides,
  }
}

export function fakeTemplateTechCheck(
  overrides?: Partial<Cards['techCheck']>,
): Cards['techCheck'] {
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
  overrides?: Partial<Cards['sidebar']>,
): Cards['sidebar'] {
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
  overrides?: Partial<Cards['zoomBackgrounds']>,
): Cards['zoomBackgrounds'] {
  return {
    borderColor: '#000000',
    borderRadius: 0,
    borderThickness: 0,
    imagesPerRow: 2,
    menuTitle: 'Backgrounds',
    isVisible: true,
    ...overrides,
  }
}
