import {Sidebar} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {EntityList} from 'lib/list'
import {colors} from 'lib/ui/theme'
import {Column} from 'lib/ui/layout'
import {GridSize} from '@material-ui/core/Grid'
import {useTemplate, useUpdate} from 'Event/TemplateProvider'
import {BaseTemplate, BASE_DEFAULTS, Header} from 'Event/template'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {DeepRequired} from 'lib/type-utils'
import {SidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

export const SIMPLE_BLOG = 'Simple Blog'

export function useSimpleBlog() {
  const template = useTemplate()

  const update = useUpdate<SimpleBlog>()

  if (template.name !== SIMPLE_BLOG) {
    throw new Error('useSimpleBlog called with wrong template')
  }

  return {template, update}
}

export type SimpleBlog = BaseTemplate & {
  name: typeof SIMPLE_BLOG
  isDarkMode?: boolean
  title: string
  mainNav: EntityList<NavButtonWithSize>
  welcomeText?: string
  heroImageSize?: number
  sidebar: Sidebar
  sidebarItems: SidebarItem[]
  blogPosts: EntityList<BlogPost>
  textColor?: string
  linkColor?: string
  linkUnderline?: boolean
  points_unit: string
  postStyles?: {
    titleTextColor?: string
    titleCapitalize?: boolean
    titleFontSize?: number
    dateTextColor?: string
    contentFontSize?: number
    contentTextColor?: string
    spacing?: number
  }
  header: SimpleBlogHeader
  dashboardBackground?: {
    color: string
    opacity: number
  }
  footer: {
    background: string
    textColor: string
    termsLink: string | null
    privacyLink: string | null
    copyrightText: string | null
    imageSize?: number
  }
  progressBar: {
    barColor: string
    textColor: string
    thickness: number
    borderRadius: number
    showing?: boolean
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
  menu: {
    backgroundColor: string
    iconColor: string
    textColor: string
  }
  backgroundPosition: 'fixed' | 'bottom'
  login: {
    emailLabel?: string
    passwordLabel?: string
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
  }
  setPasswordForm?: {
    title?: string
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
  bodyHTMLEmbed?: string | null
  leaderboard?: {
    title?: string
    description?: string
    backToDashboardText?: string
    backToDashboardTextColor?: string
  }
  sponsors?: {
    imageSize?: Column
    description?: string
    backToDashboardText?: string
    backToDashboardTextColor?: string
    sponsorSpace?: number
    sponsorSeparator?: boolean
    orderedIds?: number[]
  }
  speakers?: {
    title?: string
    description?: string
    backToDashboardText?: string
    backToDashboardTextColor?: string
    speakerImageSize?: Column
    speakersSpace?: number
    orderedIds?: number[]
  }
  faq?: {
    title?: string
    description?: string
    backToDashboardText?: string
    backToDashboardTextColor?: string
    orderedIds?: number[]
  }
  zoomBackgrounds?: {
    borderColor?: string
    borderRadius?: number
    borderThickness?: number
    imagesPerRow?: number
    backToDashboardText?: string
    backToDashboardTextColor?: string
    orderedIds?: number[]
  }
  offlinePage?: {
    shouldRedirect: boolean
    title: string
    description: string
    redirectUrl: string
  }
}

export type SimpleBlogHeader = Header & {
  backgroundColor: string
  backgroundOpacity: number
  height: number
  isCollapsed?: boolean
  disableShadow?: boolean
}

export const createSimpleBlog = (): DeepRequired<SimpleBlog> => ({
  ...BASE_DEFAULTS,
  version: 1,
  name: SIMPLE_BLOG,
  title: '',
  mainNav: {
    entities: {},
    ids: [],
  },
  points_unit: 'Points',
  welcomeText: 'WELCOME TO YOUR DASHBOARD',
  sidebar: {
    background: 'blue',
    textColor: '#ffffff',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#000000',
    paddingTop: 48,
    isVisible: true,
    separatorColor: '#FFFFFF',
    separatorStyle: 'solid',
    separatorWidth: 1,
  },
  sidebarItems: [],
  techCheck: {
    buttonText: 'submit',
    buttonBackground: 'blue',
    buttonTextColor: '#ffffff',
    buttonBorderRadius: 0,
    buttonBorderWidth: 0,
    buttonBorderColor: '#ffffff',
    buttonWidth: 12,
    hasCustomButtons: false,
    buttons: {
      ids: [],
      entities: {},
    },
  },
  waiver: {
    buttonText: 'submit',
    buttonBackground: 'blue',
    buttonTextColor: '#ffffff',
    buttonBorderRadius: 0,
    buttonBorderWidth: 0,
    buttonBorderColor: '#ffffff',
    buttonWidth: 12,
  },
  blogPosts: {
    entities: {},
    ids: [],
  },
  backgroundPosition: 'fixed',
  heroImageSize: 50,
  isDarkMode: false,
  textColor: '#000000',
  linkColor: '#000000',
  linkUnderline: true,
  header: {
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 1.0,
    height: 150,
    isCollapsed: false,
    disableShadow: false,
  },
  footer: {
    background: '#00e0000',
    textColor: '#FFFFFF',
    termsLink: null,
    privacyLink: null,
    copyrightText: null,
    imageSize: 100,
  },
  progressBar: {
    barColor: '#0969d6',
    textColor: '#000000',
    thickness: 15,
    borderRadius: 50,
    showing: true,
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
      hoverColor: colors.primary,
      label: 'Login',
      borderRadius: 56,
    },
    backgroundHidden: false,
    description: {
      text: '',
      color: '#000000',
      fontSize: 18,
    },

    logoHidden: false,
    inputBorderRadius: 56,
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
    logoSize: 20,
    emailLabel: 'Email',
    passwordLabel: 'Password',
    passwordReset: {
      linkLabel: 'Forgot Password?',
      buttonText: 'Send Reset Password Link',
      description: 'Send password reset link.',
      successMessage:
        "Password reset link sent! Check your spam folder if you don't see it after a couple minutes.",
    },
  },
  bodyHTMLEmbed: null,
  sponsors: {
    imageSize: 4,
    description: '',
    backToDashboardText: 'Back to Dashboard',
    backToDashboardTextColor: '#000000',
    sponsorSpace: 0,
    orderedIds: [],
    sponsorSeparator: true,
  },
  speakers: {
    title: 'Our Speakers',
    description: '',
    backToDashboardText: 'Back to Dashboard',
    backToDashboardTextColor: '#000000',
    speakerImageSize: 2,
    speakersSpace: 0,
    orderedIds: [],
  },
  zoomBackgrounds: {
    borderColor: '#000000',
    borderRadius: 0,
    borderThickness: 0,
    imagesPerRow: 2,
    backToDashboardText: 'Back to Dashbaord',
    backToDashboardTextColor: '#000000',
    orderedIds: [],
  },
  postStyles: {
    titleTextColor: '#000000',
    titleFontSize: 30,
    titleCapitalize: true,
    dateTextColor: '#adadad',
    contentTextColor: '#000000',
    contentFontSize: 17,
    spacing: 32,
  },
  dashboardBackground: {
    color: '#FFFFFF',
    opacity: 0,
  },
  setPasswordForm: {
    title: 'Please set a password to continue',
    description: '',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    button: {
      text: 'Submit',
      textColor: '#FFFFFF',
      backgroundColor: colors.primary,
      hoverBackgroundColor: colors.primary,
      borderRadius: 0,
    },
  },
  leaderboard: {
    title: 'Leaderboard',
    description:
      '<p>{{first name}}, you have earned {{leaderboard_points}} {{points_unit}}, and you are currently {{leaderboard_position}}. Great Job!</p><p><i>The list below is the top 200 point earners! If you don’t see your name listed, there’s still time!</i></p><p><br>&nbsp;</p>',
    backToDashboardText: 'Back to Dashboard',
    backToDashboardTextColor: '#000000',
  },
  faq: {
    title: 'FAQ',
    description: '',
    backToDashboardText: 'Back to Dashboard',
    backToDashboardTextColor: '#000000',
    orderedIds: [],
  },
  offlinePage: {
    shouldRedirect: false,
    redirectUrl: '',
    title: 'Event Offline',
    description: 'Please check back again, or contact support for access.',
  },
})

export const DEFAULTS = createSimpleBlog()
