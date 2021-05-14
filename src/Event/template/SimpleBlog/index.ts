import {
  DEFAULT_TITLE as DEFAULT_SPEAKER_PAGE_TITLE,
  DEFAULT_BACK_TO_DASHBOARD_TEXT as DEFAULT_SPEAKER_PAGE_BACK_TO_DASHBOARD_TEXT,
} from 'organization/Event/SpeakerPageConfig/SpeakerPageEditDialog/Form/index'
import {ResourceList} from 'Event/Dashboard/components/ResourceList'
import {Points} from 'Event/Dashboard/components/PointsSummary'
import {Agenda} from 'Event/Dashboard/components/AgendaList'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {EmojiList} from 'Event/Dashboard/components/EmojiList'
import {Sidebar} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {Header} from 'Event/template/SimpleBlog/Dashboard/Header'
import {TicketRibbon} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import {EntityList} from 'lib/list'
import {colors} from 'lib/ui/theme'
import {DEFAULT_LOGO_SIZE_PERCENT} from 'Event/template/SimpleBlog/Login/LoginConfig'
import {GridSize} from '@material-ui/core'
import {Column} from 'lib/ui/layout'
import {DEFAULT_SPONSOR_IMAGE_SIZE} from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card'

export const SIMPLE_BLOG = 'Simple Blog'

export interface SimpleBlog {
  version: number
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
  agenda: {
    title: string
    description?: string
    footer?: string
    items: Agenda[]
  }
  points: Points | null
  resourceList: ResourceList
  header: Header
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
  zoomBackgrounds: {
    borderColor: string
    borderRadius: number
    borderThickness: number
    imagesPerRow: number
    backToDashboardText: string
    backToDashboardTextColor: string
    orderedIds?: number[]
  }
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
    borderColor: '#000000',
    borderRadius: 0,
    borderThickness: 0,
    imagesPerRow: 2,
    backToDashboardText: 'Back to Dashboard',
    backToDashboardTextColor: '#000000',
  },
})
