import {GridSize} from '@material-ui/core/Grid'
import {EmojiList} from 'Event/template/Panels/Dashboard/EmojiList'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {ResourceList} from 'Event/template/Panels/Dashboard/Resources/ResourceList'
import {BaseTemplate} from 'Event/template'
import {TicketRibbon} from 'Event/template/Panels/Dashboard/TicketRibbons'
import {EntityList} from 'lib/list'
import {Column} from 'lib/ui/layout'
import {useTemplate, useUpdate} from 'Event/TemplateProvider'
import {
  DEFAULT_STEP_1_ICON,
  DEFAULT_STEP_2_ICON,
  DEFAULT_STEP_3_ICON,
} from 'Event/template/Panels/check-in/StepIndicator'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {DEFAULT_POINTS_UNIT} from 'Event/template/SimpleBlog/Dashboard/PointsSummary/SetPointsButton'

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
  emojiList: EmojiList
  leftPanel: {
    barBackgroundColor: string
    barTextColor: string
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
  step1Icon: string | null
  step2Label: string
  step2Icon: string | null
  step3Label: string
  step3Icon: string | null
  textColor?: string
  linkColor?: string
  linkUnderline?: boolean
  bodyHTMLEmbed?: string | null
  leaderboard: {
    title: string
    description: string
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
  }
  points: {
    unit: string
  }
}

export const createPanels = (): Panels => ({
  version: 1,
  name: PANELS,
  menu: {
    backgroundColor: '#54CFD6',
    iconColor: '#FFFFFF',
    textColor: '#FFFFFF',
    height: 65,
  },
  accentColor: '#B8FFF7',
  header: {
    script: null,
  },
  points: {
    unit: DEFAULT_POINTS_UNIT,
  },
  nav: {
    entities: {},
    ids: [],
  },
  leaderboard: {
    title: 'Leaderboard',
    description:
      '<p>{{first name}}, you have earned {{leaderboard_points}} {{points_unit}}, and you are currently {{leaderboard_position}}. Great Job!</p><p><i>The list below is the top 200 point earners! If you don’t see your name listed, there’s still time!</i></p><p><br>&nbsp;</p>',
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
  step1Icon: DEFAULT_STEP_1_ICON,
  step2Label: 'Step 2',
  step2Icon: DEFAULT_STEP_2_ICON,
  step3Label: 'Step 3',
  step3Icon: DEFAULT_STEP_3_ICON,
  ticketRibbons: [],
  welcomeText: 'Welcome!',
  emojiList: {
    emojis: [],
  },
  leftPanel: {
    barBackgroundColor: '#07BAB5',
    barTextColor: '#ffffff',
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
      borderRadius: 4,
    },
  },
  menuIconColor: '#000000',
})
