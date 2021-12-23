import {GridSize, GridSpacing} from '@material-ui/core/Grid'

import {BlogPost} from 'Event/Dashboard/components/BlogPosts'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {BaseTemplate, BASE_DEFAULTS} from 'Event/template'
import {EmojiList} from 'Event/template/FiftyBlog/Dashboard/EmojiList'
import {ResourceList} from 'Event/template/FiftyBlog/Dashboard/Resources/ResourceList'
import {useTemplate} from 'Event/TemplateProvider'
import {useTemplateUpdate} from 'Event/TemplateUpdateProvider'

import {EntityList, HashMap} from 'lib/list'
import {Column} from 'lib/ui/layout'
import {colors} from 'lib/ui/theme'
import {DeepRequired} from 'lib/type-utils'

export const FIFTY_BLOG = 'Nifty Fifty'

export function useFiftyBlogTemplate() {
  const template = useTemplate()

  if (template.name !== FIFTY_BLOG) {
    throw new Error('useFiftyBlog called with wrong template')
  }

  return template
}

export function useFiftyBlogUpdate() {
  return useTemplateUpdate<FiftyBlog>()
}

/**
 * Whether the template has other tabs/sections to navigate to. Useful
 * to check for cases where we want to hide something when there is
 * only one tab. ie. home button.
 *
 * @returns
 */
export function useHasMultipleTabs() {
  const {
    resourceList: {isVisible: showingResources},
    leaderboard: {isVisible: showingPoints},
    speakers: {isVisible: showingSpeakers},
    sponsors: {isVisible: showingSponsors},
    imageWaterfall: {isVisible: showingImageWaterfall},
    faq: {isVisible: showingFaqs},
  } = useFiftyBlogTemplate()

  return (
    showingSpeakers ||
    showingSponsors ||
    showingResources ||
    showingPoints ||
    showingImageWaterfall ||
    showingFaqs
  )
}

export type FiftyBlog = BaseTemplate &
  CustomBackgrounds & {
    name: typeof FIFTY_BLOG
    accentColor: string
    menu: {
      backgroundColor: string
      iconColor: string
      textColor: string
      height: number
    }
    backgroundPosition?: 'fixed' | 'bottom'
    nav: HashMap<NavButtonWithSize>
    welcomeText: string
    homeMenuTitle?: string
    emojiList: EmojiList
    leftPanel: {
      backgroundHidden: boolean
      barTextColor: string
      menuTextColor?: string
      arrowColor?: string
      backgroundColor: string
      backgroundOpacity: number
    }
    dashboardLogoProps?: {
      hidden?: boolean
      size: number
    }
    dashboardBackgroundProps?: {
      hidden?: boolean
      size: number
    }
    loginBackgroundProps?: {
      hidden?: boolean
      size: number
    }
    loginLogoProps?: {
      hidden?: boolean
      size: number
    }
    loginLogoBackgroundProps?: {
      hidden?: boolean
      size: number
    }
    stepLogoProps?: {
      hidden?: boolean
      size: number
    }
    stepBackgroundProps?: {
      hidden?: boolean
      size: number
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
    blogPosts: HashMap<BlogPost>
    resourceList: ResourceList
    menuIconColor: string
    isDarkMode?: boolean
    background?: {
      color?: string
      opacity?: number
    }
    checkInRightPanel: {
      backgroundColor: string
      backgroundOpacity: number
      textColor: string
      progressActiveColor: string
      progressInActiveColor: string
    }
    checkInTitle: string
    checkInColor: string
    checkInLeftPanel: {
      backgroundColor: string
      backgroundOpacity: number
      textColor: string
      inactiveTextColor: string
    }
    stepLabelColor: string
    stepIconColor: string
    stepInactiveColor: string
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
      // logoHidden?: boolean
      // logoBackgroundHidden?: boolean
      // backgroundHidden?: boolean
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
      title?: string
      description?: string
      orderedIds?: number[]
      perRow?: number
      menuTitle?: string
      cardBackgroundColor?: string
      cardBackgroundOpacity?: number
      isVisible?: boolean
    }
    speakers?: {
      title?: string
      description?: string
      speakerImageSize?: Column
      speakersSpace?: GridSpacing
      orderedIds?: number[]
      menuTitle?: string
      isVisible?: boolean
    }
    offlinePage?: {
      title: string
      description: string
      redirectUrl: string
      shouldRedirect: boolean
    }
    imageWaterfall?: {
      title?: string
      menuTitle?: string
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
      isVisible?: boolean
    }
    progressBar: {
      barColor: string
      backgroundColor: string
      textColor: string
      thickness: number
      borderRadius: number
      showing: boolean
      checkInTitle: string
      checkInColor: string
      step1Text: string
      step1Percent: number
      step2Text: string
      step2Percent: number
      step3Text: string
      step3Percent: number
    }
  }

export type CustomBackgrounds = {
  dashboardLogo: string | null
  dashboardBackground: string | null
  loginBackground: string | null
  loginLogo: string | null
  loginLogoBackground: string | null
  stepLogo: string | null
  stepBackground: string | null
}

export const createFiftyBlog = (): DeepRequired<FiftyBlog> => ({
  ...BASE_DEFAULTS,
  version: 1,
  name: FIFTY_BLOG,
  accentColor: '#B8FFF7',
  menu: {
    backgroundColor: '#54CFD6',
    iconColor: '#000000',
    textColor: '#000000',
    height: 65,
  },
  points_unit: 'Points',
  backgroundPosition: 'fixed',
  nav: {},
  welcomeText: 'Welcome!',
  homeMenuTitle: 'Home',
  emojiList: {
    emojis: [],
    emojiWidth: null,
  },
  leftPanel: {
    backgroundHidden: false,
    barTextColor: '#000000',
    menuTextColor: '#000000',
    arrowColor: '#000000',
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
  },
  dashboardLogoProps: {
    hidden: false,
    size: 20,
  },
  dashboardBackgroundProps: {
    hidden: false,
    size: 20,
  },
  loginBackgroundProps: {
    hidden: false,
    size: 20,
  },
  loginLogoProps: {
    hidden: false,
    size: 20,
  },
  loginLogoBackgroundProps: {
    hidden: false,
    size: 20,
  },
  stepLogoProps: {
    hidden: false,
    size: 20,
  },
  stepBackgroundProps: {
    hidden: false,
    size: 20,
  },
  rightPanel: {
    barBackgroundColor: '#07BAB5',
    barTextColor: '#000000',
    tabUnderlineColor: '#B8FFF7',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
    isDarkMode: false,
  },
  blogPosts: {},
  resourceList: {
    title: 'Resources',
    resources: [],
    menuTitle: 'Resources',
    isVisible: true,
    cardBackgroundColor: '#FFFFFF',
    cardBackgroundOpacity: 1,
    color: '#000000',
    linkColor: 'blue',
  },
  menuIconColor: '#000000',
  isDarkMode: false,
  background: {
    color: '#FFFFFF',
    opacity: 0,
  },
  checkInRightPanel: {
    backgroundColor: '#07BAB5',
    backgroundOpacity: 1,
    textColor: '#000000',
    progressActiveColor: '#131D34',
    progressInActiveColor: '#EDF2F8',
  },
  checkInTitle: 'Check In:',
  checkInColor: '#000000',
  checkInLeftPanel: {
    backgroundColor: '#FFFFFF',
    backgroundOpacity: 0,
    textColor: '#000000',
    inactiveTextColor: '#C7C7C7',
  },
  stepLabelColor: '#07BAB5',
  stepIconColor: '#07BAB5',
  stepInactiveColor: '#C7C7C7',
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
    isVisible: true,
  },
  faq: {
    title: 'FAQ',
    description: '',
    orderedIds: [],
    menuTitle: 'Faqs',
    isVisible: true,
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
      backgroundColor: '#3490DC',
      textColor: '#FFFFFF',
      label: 'Login',
      borderRadius: 56,
      hoverColor: '#24649a',
    },
    description: {
      text: 'Welcome to the TRIBE Live Virtual Experience!',
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
    // logoHidden: false,
    // backgroundHidden: false,
    // logoBackgroundHidden: false,
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
    title: 'Sponsors',
    description: '',
    orderedIds: [],
    perRow: 2,
    menuTitle: 'Sponsors',
    cardBackgroundColor: '#565656',
    cardBackgroundOpacity: 100,
    isVisible: true,
  },
  speakers: {
    title: 'Our Speakers',
    description: '',
    speakerImageSize: 2,
    speakersSpace: 0,
    orderedIds: [],
    menuTitle: 'Speakers',
    isVisible: true,
  },
  offlinePage: {
    shouldRedirect: false,
    redirectUrl: '',
    title: 'Event Offline',
    description: 'Please check back again, or contact support for access.',
  },
  imageWaterfall: {
    title: 'Image Waterfall',
    menuTitle: 'Image Waterfall',
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
    isVisible: true,
  },
  progressBar: {
    barColor: '#0969d6',
    backgroundColor: '#b1d4f1',
    textColor: '#000000',
    thickness: 15,
    borderRadius: 50,
    showing: true,
    checkInTitle: 'Check In:',
    checkInColor: '#000000',
    step1Text: 'Step 1',
    step1Percent: 33,
    step2Text: 'Step 2',
    step2Percent: 66,
    step3Text: 'Step 3',
    step3Percent: 100,
  },
  dashboardLogo: null,
  dashboardBackground: null,
  loginBackground: null,
  loginLogo: null,
  loginLogoBackground: null,
  stepLogo: null,
  stepBackground: null,
})

export const DEFAULTS = createFiftyBlog()
