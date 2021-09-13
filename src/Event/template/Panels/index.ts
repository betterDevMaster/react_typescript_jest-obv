import {GridSize} from '@material-ui/core/Grid'
import {EmojiList} from 'Event/template/Panels/Dashboard/EmojiList'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {ResourceList} from 'Event/template/Panels/Dashboard/Resources/ResourceList'
import {BaseTemplate, BASE_DEFAULTS} from 'Event/template'
import {EntityList} from 'lib/list'
import {Column} from 'lib/ui/layout'
import {useTemplate, useUpdate} from 'Event/TemplateProvider'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {colors} from 'lib/ui/theme'
import {DeepRequired} from 'lib/type-utils'
import {TicketRibbon} from 'Event/template/Panels/Dashboard/TicketRibbonList/TicketRibbon'

export const PANELS = 'Panels'

export function usePanels() {
  const template = useTemplate()
  const update = useUpdate<Panels>()

  if (template.name !== PANELS) {
    throw new Error('usePanels called with wrong template')
  }

  return {template, update}
}

export type Panels = BaseTemplate & {
  name: typeof PANELS
  accentColor: string
  menu: {
    backgroundColor: string
    iconColor: string
    textColor: string
    height: number
  }
  backgroundPosition?: 'fixed' | 'bottom'
  nav: EntityList<NavButtonWithSize>
  ticketRibbons: TicketRibbon[]
  welcomeText: string
  homeMenuTitle?: string
  emojiList: EmojiList
  leftPanel: {
    barBackgroundColor: string
    barTextColor: string
    menuTextColor?: string
    backgroundColor: string
    backgroundOpacity: number
  }
  rightPanel: {
    barBackgroundColor: string
    barTextColor: string
    tabUnderlineColor: string
    textColor: string
    backgroundColor: string
    backgroundOpacity: number
    isDarkMode: boolean
  }
  points_unit: string
  blogPosts: EntityList<BlogPost>
  resourceList: ResourceList
  menuIconColor: string
  isDarkMode?: boolean
  background?: {
    color?: string
    opacity?: number
  }
  checkInTitle: string
  checkInRightPanel: {
    backgroundColor: string
    backgroundOpacity: number
    textColor: string
  }
  checkInLeftPanel: {
    backgroundColor: string
    backgroundOpacity: number
    textColor: string
    inactiveTextColor: string
  }
  stepLabelColor: string
  step1Label: string
  step1Icon?: string
  step2Label: string
  step2Icon?: string
  step3Label: string
  step3Icon?: string
  textColor?: string
  linkColor?: string
  linkUnderline?: boolean
  bodyHTMLEmbed?: string | null
  leaderboard: {
    title: string
    description: string
    menuTitle?: string
  }
  faq?: {
    title?: string
    description?: string
    orderedIds?: number[]
  }
  zoomBackgrounds?: {
    borderColor?: string
    borderRadius?: number
    borderThickness?: number
    orderedIds?: number[]
  }
  techCheck?: {
    buttonText?: string
    buttonBackground?: string
    buttonTextColor?: string
    buttonBorderRadius?: number
    buttonBorderWidth?: number
    buttonBorderColor?: string
    buttonWidth?: GridSize
    hasCustomButtons?: boolean
    buttons?: EntityList<NavButtonWithSize>
  }
  waiver?: {
    buttonText?: string
    buttonBackground?: string
    buttonTextColor?: string
    buttonBorderRadius?: number
    buttonBorderWidth?: number
    buttonBorderColor?: string
    buttonWidth?: GridSize
  }
  login?: {
    submitButton: {
      backgroundColor: string
      textColor: string
      hoverColor?: string
      label: string
      borderRadius?: number
    }
    description: {
      text: string
      color: string
      fontSize: number
    }
    passwordReset: {
      linkLabel: string
      buttonText: string
      description: string
      successMessage: string
    }
    backgroundColor?: string
    backgroundOpacity?: number
    logoSize?: number
    inputBorderRadius?: number
    logoHidden?: boolean
    backgroundHidden?: boolean
    emailLabel?: string
    passwordLabel?: string
  }
  setPasswordForm: {
    title: string
    description?: string
    passwordLabel?: string
    confirmPasswordLabel?: string
    button?: {
      text?: string
      textColor?: string
      backgroundColor?: string
      hoverBackgroundColor?: string
      borderRadius?: number
    }
  }
  sponsors?: {
    description?: string
    orderedIds?: number[]
    columnSize?: number
  }
  speakers?: {
    title?: string
    description?: string
    speakerImageSize?: Column
    speakersSpace?: number
    orderedIds?: number[]
    menuTitle?: string
  }
  offlinePage?: {
    title: string
    description: string
    redirectUrl: string
    shouldRedirect: boolean
  }
}

export const createPanels = (): DeepRequired<Panels> => ({
  ...BASE_DEFAULTS,
  version: 1,
  name: PANELS,
  accentColor: '#B8FFF7',
  menu: {
    backgroundColor: '#54CFD6',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF',
    height: 65,
  },
  points_unit: 'Points',
  backgroundPosition: 'fixed',
  nav: {
    entities: {},
    ids: [],
  },
  ticketRibbons: [],
  welcomeText: 'Welcome!',
  homeMenuTitle: 'Home',
  emojiList: {
    emojis: [],
    emojiWidth: null,
  },
  leftPanel: {
    barBackgroundColor: '#07BAB5',
    barTextColor: '#ffffff',
    menuTextColor: '#000000',
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
  },
  rightPanel: {
    barBackgroundColor: '#07BAB5',
    barTextColor: '#ffffff',
    tabUnderlineColor: '#B8FFF7',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
    isDarkMode: false,
  },
  blogPosts: {
    entities: {},
    ids: [],
  },
  resourceList: {
    title: 'Resources',
    resources: [],
    cardBackgroundColor: '#FFFFFF',
    menuTitle: 'Resources',
  },
  menuIconColor: '#000000',
  isDarkMode: false,
  background: {
    color: '#FFFFFF',
    opacity: 0,
  },
  checkInTitle: 'Check In:',
  checkInRightPanel: {
    backgroundColor: '#07BAB5',
    backgroundOpacity: 1,
    textColor: '#000000',
  },
  checkInLeftPanel: {
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
    textColor: '#000000',
    inactiveTextColor: '#C7C7C7',
  },
  stepLabelColor: '#07BAB5',
  step1Label: 'Step 1',
  step1Icon: 'far fa-lock',
  step2Label: 'Step 2',
  step2Icon: 'far fa-clipboard',
  step3Label: 'Step 3',
  step3Icon: 'far fa-desktop',
  textColor: '#000000',
  linkColor: '#000000',
  linkUnderline: true,
  bodyHTMLEmbed: null,
  leaderboard: {
    title: 'Leaderboard',
    description:
      '<p>{{first name}}, you have earned {{leaderboard_points}} {{points_unit}}, and you are currently {{leaderboard_position}}. Great Job!</p><p><i>The list below is the top 200 point earners! If you don’t see your name listed, there’s still time!</i></p><p><br>&nbsp;</p>',
    menuTitle: 'Points',
  },
  faq: {
    title: 'FAQ',
    description: '',
    orderedIds: [],
  },
  zoomBackgrounds: {
    borderColor: '#000000',
    borderRadius: 0,
    borderThickness: 0,
    orderedIds: [],
  },
  techCheck: {
    buttonText: 'Start Tech Check',
    buttonBackground: colors.primary,
    buttonTextColor: '#FFFFFF',
    buttonBorderRadius: 0,
    buttonBorderWidth: 0,
    buttonBorderColor: colors.primary,
    buttonWidth: 12,
    hasCustomButtons: false,
    buttons: {
      ids: [],
      entities: {},
    },
  },
  waiver: {
    buttonText: 'Submit',
    buttonBackground: colors.primary,
    buttonTextColor: '#FFFFFF',
    buttonBorderRadius: 0,
    buttonBorderWidth: 0,
    buttonBorderColor: colors.primary,
    buttonWidth: 12,
  },
  login: {
    submitButton: {
      backgroundColor: '#FFFFFF',
      textColor: '#FFFFFF',
      label: 'Login',
      borderRadius: 56,
      hoverColor: '#FFFFFF',
    },
    description: {
      text: '',
      color: '#000000',
      fontSize: 18,
    },
    passwordReset: {
      linkLabel: 'Forgot Password?',
      buttonText: 'Send Reset Password Link',
      description: 'Send password reset link.',
      successMessage:
        "Password reset link sent! Check your spam folder if you don't see it after a couple minutes.",
    },
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
    logoSize: 20,
    inputBorderRadius: 56,
    logoHidden: false,
    backgroundHidden: false,
    emailLabel: 'Email',
    passwordLabel: 'Password',
  },
  setPasswordForm: {
    title: "You're almost ready",
    description: "First, you'll need to create a password below:",
    passwordLabel: 'Enter your password',
    confirmPasswordLabel: 'Re-Enter Your Password',
    button: {
      text: 'Next Step',
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
      hoverBackgroundColor: '#000000',
      borderRadius: 4,
    },
  },
  sponsors: {
    description: '',
    orderedIds: [],
    columnSize: 2,
  },
  speakers: {
    title: 'Our Speakers',
    description: '',
    speakerImageSize: 2,
    speakersSpace: 0,
    orderedIds: [],
    menuTitle: 'Speakers',
  },
  offlinePage: {
    shouldRedirect: false,
    redirectUrl: '',
    title: 'Event Offline',
    description: 'Please check back again, or contact support for access.',
  },
})

export const DEFAULTS = createPanels()
