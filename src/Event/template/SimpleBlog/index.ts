import {ResourceList} from 'Event/Dashboard/components/ResourceList'
import {Points} from 'Event/Dashboard/components/PointsSummary'
import {Agenda} from 'Event/Dashboard/components/AgendaList'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {EmojiList} from 'Event/Dashboard/components/EmojiList'
import {TicketRibbon} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import {EntityList} from 'lib/list'
import {colors} from 'lib/ui/theme'
import {DEFAULT_LOGO_SIZE_PERCENT} from 'Event/template/SimpleBlog/Login/LoginConfig'

export const SIMPLE_BLOG = 'Simple Blog'

export interface SimpleBlog {
  version: number
  name: typeof SIMPLE_BLOG
  title: string
  mainNav: EntityList<NavButtonWithSize>
  ticketRibbons: TicketRibbon[]
  welcomeText?: string
  emojiList: EmojiList
  sidebar: {
    background: string
    textColor: string
    borderRadius: number
    borderWidth: number
    borderColor: string
    paddingTop?: number
  }
  sidebarNav: EntityList<NavButton>
  blogPosts: EntityList<BlogPost>
  agenda: {
    title: string
    items: Agenda[]
  }
  points: Points | null
  resourceList: ResourceList
  header: {
    backgroundColor: string
    backgroundOpacity: number
    height: number
    script: string | null
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
      label: string
    }
    description: {
      text: string
      color: string
      fontSize: number
    }
    logoSize?: number
  }
  bodyHTMLEmbed?: string | null
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
  },
  footer: {
    background: '#000000',
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
    logoSize: DEFAULT_LOGO_SIZE_PERCENT,
  },
  bodyHTMLEmbed: null,
})
