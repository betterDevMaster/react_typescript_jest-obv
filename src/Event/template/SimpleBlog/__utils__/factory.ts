import faker from 'faker'
import {pipe} from 'ramda'
import {withAgendas} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList/__utils__/factory'
import {withTicketRibbons} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/__utils__/factory'
import {withBlogPosts} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {createSimpleBlog, SimpleBlog} from 'Event/template/SimpleBlog'
import {colors} from 'lib/ui/theme'
export const fakeSimpleBlog = (overrides?: Partial<SimpleBlog>): SimpleBlog => {
  const defaultAttributes: SimpleBlog = createSimpleBlog()

  const makeAttributes: (d: SimpleBlog) => SimpleBlog = pipe(
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
    passwordReset: {
      linkLabel: 'Forgot My Password?',
      buttonText: 'Submit',
      description: 'Please check your email once you submit.',
      successMessage: 'Success!',
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
    backToDashboardText: 'Back to Dashboard',
    backToDashboardTextColor: '#000000',
    ...overrides,
  }
}
