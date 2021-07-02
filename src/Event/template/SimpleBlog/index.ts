import {
  DEFAULT_TITLE as DEFAULT_SPEAKER_PAGE_TITLE,
  DEFAULT_BACK_TO_DASHBOARD_TEXT as DEFAULT_SPEAKER_PAGE_BACK_TO_DASHBOARD_TEXT,
} from 'Event/template/SimpleBlog/SpeakerPage/SpeakerPageConfig/SpeakerPageEditDialog/Form/index'
import {ResourceList} from 'Event/template/SimpleBlog/Dashboard/ResourceList'
import {Agenda} from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import {EmojiList} from 'Event/template/SimpleBlog/Dashboard/EmojiList'
import {Sidebar} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {TicketRibbon} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbon'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import {EntityList} from 'lib/list'
import {colors} from 'lib/ui/theme'
import {DEFAULT_LOGO_SIZE_PERCENT} from 'Event/template/SimpleBlog/Login/LoginConfig'
import {Column} from 'lib/ui/layout'
import {DEFAULT_SPONSOR_IMAGE_SIZE} from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card'
import {FontStyle} from 'lib/ui/typography/FontStyleInput'
import {GridSize} from '@material-ui/core/Grid'
import {useTemplate, useUpdate} from 'Event/TemplateProvider'
import {BaseTemplate, Header} from 'Event/template'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {Points} from 'Event/template/SimpleBlog/Dashboard/PointsSummary'
import {
  DEFAULT_BACK_TO_DASHBOARD_TEXT,
  DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
  DEFAULT_BORDER_COLOR,
  DEFAULT_IMAGES_PER_ROW,
} from 'Event/template/SimpleBlog/Backgrounds'

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
  ticketRibbons: TicketRibbon[]
  welcomeText?: string
  heroImageSize?: number
  emojiList: EmojiList
  sidebar: Sidebar
  sidebarNav: EntityList<NavButton>
  blogPosts: EntityList<BlogPost>
  points: Points | null
  textColor?: string
  linkColor?: string
  linkUnderline?: boolean
  postStyles?: {
    titleTextColor?: string
    titleCapitalize?: boolean
    titleFontSize?: number
    dateTextColor?: string
    contentFontSize?: number
    contentTextColor?: string
  }
  agenda: {
    title: string
    description?: string
    footer?: string
    descriptionFontStyles?: FontStyle[]
    footerFontStyles?: FontStyle[]
    items: Agenda[]
  }
  resourceList: ResourceList
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
  attendeePDFExport?: {
    active?: boolean
    header?: {
      title: string
      color: string
    }
    body?: {
      backgroundOverlayColor: string
      backgroundOverlayColorOpacity: number
    }
    footer?: {
      backgroundColor: string
      text: string
      textColor: string
    }
    formIds?: number[] | null
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
}

export type SimpleBlogHeader = Header & {
  backgroundColor: string
  backgroundOpacity: number
  height: number
  isCollapsed?: boolean
  disableShadow?: boolean
}

export const createSimpleBlog = (): SimpleBlog => ({
  version: 1,
  name: SIMPLE_BLOG,
  title: '',
  mainNav: {
    entities: {},
    ids: [],
  },
  ticketRibbons: [],
  welcomeText: 'WELCOME TO YOUR DASHBOARD',
  emojiList: {
    emojis: [],
  },
  sidebar: {
    background: 'blue',
    textColor: '#ffffff',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#000000',
    paddingTop: 48,
    isVisible: true,
  },
  techCheck: {
    buttonText: 'submit',
    buttonBackground: 'blue',
    buttonTextColor: '#ffffff',
    buttonBorderRadius: 0,
    buttonBorderWidth: 0,
    buttonBorderColor: '#ffffff',
    buttonWidth: 12,
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
  sidebarNav: {
    entities: {},
    ids: [],
  },
  blogPosts: {
    entities: {},
    ids: [],
  },
  backgroundPosition: 'fixed',
  agenda: {
    title: 'Agenda',
    description: '',
    footer: 'Agenda Time is in YOUR time zone, not ours',
    items: [],
  },
  points: null,
  resourceList: {
    title: 'Resources',
    description: '',
    resources: [],
  },
  header: {
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 1.0,
    height: 150,
    script: null,
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
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
    logoSize: DEFAULT_LOGO_SIZE_PERCENT,
  },
  bodyHTMLEmbed: null,
  sponsors: {
    imageSize: DEFAULT_SPONSOR_IMAGE_SIZE,
  },
  speakers: {
    title: DEFAULT_SPEAKER_PAGE_TITLE,
    backToDashboardText: DEFAULT_SPEAKER_PAGE_BACK_TO_DASHBOARD_TEXT,
  },
  zoomBackgrounds: {
    borderColor: DEFAULT_BORDER_COLOR,
    borderRadius: 0,
    borderThickness: 0,
    imagesPerRow: DEFAULT_IMAGES_PER_ROW,
    backToDashboardText: DEFAULT_BACK_TO_DASHBOARD_TEXT,
    backToDashboardTextColor: DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
  },
})
