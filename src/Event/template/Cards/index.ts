import {Sidebar} from 'Event/template/Cards/Dashboard/Sidebar/SidebarContainer'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {EntityList, HashMap} from 'lib/list'
import {colors} from 'lib/ui/theme'
import {Column} from 'lib/ui/layout'
import {GridSize} from '@material-ui/core/Grid'
import {useTemplate} from 'Event/TemplateProvider'
import {BaseTemplate, BASE_DEFAULTS, Header} from 'Event/template'
import {BlogPost} from 'Event/Dashboard/components/BlogPosts'
import {DeepRequired} from 'lib/type-utils'
import {SidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import {CountDownTimer} from 'Event/Dashboard/components/CountDownTimer'
import {Hero} from 'Event/template/Cards/Dashboard/Hero/HeroConfig'
import {CardsNavButtonProps} from 'Event/template/Cards/Dashboard/CardsNavButton'
import {useTemplateUpdate} from 'Event/TemplateUpdateProvider'
export const CARDS = 'Cards'

export function useCardsTemplate() {
  const template = useTemplate()

  if (template.name !== CARDS) {
    throw new Error('useCards called with wrong template')
  }

  return template
}

export function useCardsUpdate() {
  return useTemplateUpdate<Cards>()
}

export type Cards = BaseTemplate &
  CustomBackgrounds & {
    name: typeof CARDS
    accentColor: string
    isDarkMode?: boolean
    title: string
    homeMenuTitle: string
    mainNav: {
      buttons: HashMap<CardsNavButtonProps>
      buttonHeight?: number
      width?: number
      borderRadius?: number
      scrollDownText?: string
      scrollDownArrowColor?: string
    }
    hero: Hero
    sidebar: Sidebar
    sidebarItems: HashMap<SidebarItem>
    blogPosts: HashMap<BlogPost>
    textColor?: string
    linkColor?: string
    linkUnderline?: boolean
    points_unit: string
    background: {
      color: string
      opacity: number
    }
    pageLinks: {
      dividerColor: string
      textColor: string
    }
    header: CardsHeader
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
      checkBoxColor?: string
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
      additional_description: {
        text: string
        color: string
        fontSize: number
      }
      welcome: {
        text: string
        color: string
        fontSize: number
      }
      passwordReset: {
        iconName: string | null
        iconColor?: string
        linkLabel: string
        buttonText: string
        description: string
        successMessage: string
        forgotPasswordTitle: string
      }
      backgroundColor?: string
      backgroundOpacity?: number
      logoSize?: number
      inputBorderRadius?: number
      logoHidden?: boolean
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
      menuTitle?: string
      isVisible?: boolean
    }
    sponsors?: {
      title?: string
      imageSize?: Column
      description?: string
      sponsorSpace?: number
      sponsorSeparator?: boolean
      orderedIds?: number[]
      menuTitle?: string
      isVisible?: boolean
      perRow?: number
      cardBackgroundColor?: string
      cardBackgroundOpacity?: number
    }
    speakers?: {
      title?: string
      description?: string
      speakerImageSize?: Column
      speakersSpace?: number
      orderedIds?: number[]
      menuTitle?: string
      isVisible?: boolean
    }
    faq?: {
      title?: string
      description?: string
      orderedIds?: number[]
      menuTitle?: string
      isVisible?: boolean
    }
    zoomBackgrounds?: {
      borderColor?: string
      borderRadius?: number
      borderThickness?: number
      imagesPerRow?: number
      orderedIds?: number[]
      menuTitle?: string
      isVisible?: boolean
    }
    offlinePage?: {
      shouldRedirect: boolean
      title: string
      description: string
      redirectUrl: string
    }
    checkIn: {
      title: string
      titleColor: string
      stepLabelColor: string
      stepIconColor: string
      inActiveColor: string
      step1Label: string
      step1Icon: string
      step2Label: string
      step2Icon: string
      step3Label: string
      step3Icon: string
    }
    countDownTimers?: HashMap<CountDownTimer>
    imageWaterfall?: {
      title?: string
      description?: string
      uploadFormTitle?: string
      uploadFormDescription?: string
      uploadButtonText?: string
      uploadButtonFontSize?: number
      uploadButtonBorderRadius?: number
      uploadButtonTextColor?: string
      uploadButtonBackgroundColor?: string
      uploadButtonBorderColor?: string
      actionId?: string | null
      menuTitle?: string
      isVisible?: boolean
    }
  }

export type CustomBackgrounds = {
  backgroundImage1: string | null
  backgroundImage2: string | null
  backgroundImage3: string | null
  backgroundImage4: string | null
  backgroundImage5: string | null
}

export type CardsHeader = Header & {
  backgroundColor: string
  backgroundOpacity: number
  isCollapsed?: boolean
  logoSize: number
}

export const createCards = (): DeepRequired<Cards> => ({
  ...BASE_DEFAULTS,
  version: 1,
  name: CARDS,
  accentColor: '#B8FFF7',
  title: '',
  homeMenuTitle: 'Main',
  mainNav: {
    buttons: {},
    buttonHeight: 170,
    width: 80,
    borderRadius: 50,
    scrollDownText: 'SCROLL DOWN FOR MORE',
    scrollDownArrowColor: '#FFFFFF',
  },
  points_unit: 'Points',
  background: {
    color: '#FFFFFF',
    opacity: 0,
  },
  pageLinks: {
    dividerColor: '#07BAB5',
    textColor: '#000000',
  },
  hero: {
    welcomeText: 'WELCOME TO YOUR DASHBOARD',
    heroImageSize: 50,
    welcomeFontSize: 24,
    welcomeTextColor: '#000000',
  },
  sidebar: {
    background: '#ffffff',
    textColor: 'blue',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#da2727',
    paddingTop: 48,
    isVisible: true,
    separatorColor: '#FFFFFF',
    separatorStyle: 'solid',
    separatorThickness: 1,
    headBackgroundColor: '#da2727',
    headBackgroundBorder: 15,
    headTextColor: '#ffffff',
  },
  sidebarItems: {},
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
    checkBoxColor: '#3c18c5',
  },
  blogPosts: {},
  isDarkMode: false,
  textColor: '#000000',
  linkColor: '#000000',
  linkUnderline: true,
  header: {
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 1,
    logoSize: 100,
    isCollapsed: false,
  },
  footer: {
    background: '#000000',
    textColor: '#FFFFFF',
    termsLink: null,
    privacyLink: null,
    copyrightText: null,
    imageSize: 100,
  },
  menu: {
    backgroundColor: '#000000',
    iconColor: '#0969d6',
    textColor: '#FFFFFF',
  },
  backgroundPosition: 'fixed',
  login: {
    submitButton: {
      backgroundColor: colors.primary,
      textColor: '#FFFFFF',
      hoverColor: colors.primary,
      label: 'Login',
      borderRadius: 56,
    },
    description: {
      text: '',
      color: '#000000',
      fontSize: 18,
    },
    additional_description: {
      text: 'First time here or did you forget your password?',
      color: '#000000',
      fontSize: 18,
    },
    welcome: {
      text: 'Welcome',
      color: '#000000',
      fontSize: 24,
    },
    logoHidden: false,
    inputBorderRadius: 56,
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
    logoSize: 20,
    emailLabel: 'Email',
    passwordLabel: 'Password',
    passwordReset: {
      iconName: 'fas fa-lock',
      iconColor: 'blue',
      linkLabel: 'Forgot Password?',
      buttonText: 'Send Reset Password Link',
      description: 'Send password reset link.',
      forgotPasswordTitle: 'Password Help',
      successMessage:
        "Password reset link sent! Check your spam folder if you don't see it after a couple minutes.",
    },
  },
  bodyHTMLEmbed: null,
  sponsors: {
    title: 'Sponsors',
    imageSize: 4,
    description: '',
    menuTitle: 'Sponsors',
    isVisible: false,
    sponsorSpace: 0,
    orderedIds: [],
    sponsorSeparator: true,
    perRow: 2,
    cardBackgroundOpacity: 0,
    cardBackgroundColor: '#efefef',
  },
  speakers: {
    title: 'Our Speakers',
    description: '',
    menuTitle: 'Speakers',
    isVisible: false,
    speakerImageSize: 2,
    speakersSpace: 0,
    orderedIds: [],
  },
  zoomBackgrounds: {
    borderColor: '#000000',
    borderRadius: 0,
    borderThickness: 0,
    imagesPerRow: 2,
    menuTitle: 'Backgrounds',
    isVisible: false,
    orderedIds: [],
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
    menuTitle: 'Points',
    isVisible: false,
  },
  faq: {
    title: 'FAQ',
    description: '',
    menuTitle: 'Faqs',
    isVisible: false,
    orderedIds: [],
  },
  offlinePage: {
    shouldRedirect: false,
    redirectUrl: '',
    title: 'Event Offline',
    description: 'Please check back again, or contact support for access.',
  },
  checkIn: {
    title: 'Check In:',
    titleColor: '#000000',
    stepLabelColor: '#07BAB5',
    stepIconColor: '#07BAB5',
    inActiveColor: '#C7C7C7',
    step1Label: 'Step 1',
    step1Icon: 'far fa-lock',
    step2Label: 'Step 2',
    step2Icon: 'far fa-clipboard',
    step3Label: 'Step 3',
    step3Icon: 'far fa-desktop',
  },
  countDownTimers: {},
  imageWaterfall: {
    title: 'Image Waterfall',
    description: 'Image Waterfall',
    uploadFormTitle: 'Upload Image',
    uploadFormDescription: 'Upload Waterfall Image',
    uploadButtonText: 'Upload',
    uploadButtonFontSize: 12,
    uploadButtonBorderRadius: 0,
    uploadButtonTextColor: '#000000',
    uploadButtonBackgroundColor: '#FFFFFF',
    uploadButtonBorderColor: '#000000',
    actionId: null,
    menuTitle: 'Image Waterfall',
    isVisible: true,
  },
  backgroundImage1: null,
  backgroundImage2: null,
  backgroundImage3: null,
  backgroundImage4: null,
  backgroundImage5: null,
})

export const DEFAULTS = createCards()
