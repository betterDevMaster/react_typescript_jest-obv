import {Panels} from 'Event/template/Panels'
import {SimpleBlog} from 'Event/template/SimpleBlog'
import {InputStyles} from 'Event/Question'
import {DeepRequired} from 'lib/type-utils'
import {Cards} from 'Event/template/Cards'

/**
 * Base properties shared by all templates
 */
export type BaseTemplate = {
  version: number
  header: Header

  /**
   * Reward alert is the pop-up that tells the user
   * they have received points for an action.
   */
  rewardAlert?: {
    text?: string
    backgroundColor?: string
    textColor?: string
  }

  emojiPage?: {
    backgroundColor?: string
    backgroundOpacity?: number
    backgroundHidden?: boolean
  }

  postStyles?: {
    titleTextColor?: string
    titleCapitalize?: boolean
    titleFontSize?: number
    dateTextColor?: string
    contentFontSize?: number
    contentTextColor?: string
    spacing?: number
  }

  postFormStyles?: {
    width?: number
    position?: string
    buttonSize?: number
    buttonRadius?: number
    buttonColor?: string
    buttonBackgroundColor?: string
    buttonHoverBackgroundColor?: string
    buttonPosition?: string
    buttonFontSize?: number
    inputStyles?: InputStyles
  }
}

export type Template = SimpleBlog | Panels | Cards

export const BASE_DEFAULTS: DeepRequired<BaseTemplate> = {
  version: 1,
  header: {
    script: null,
  },
  rewardAlert: {
    backgroundColor: '#565656',
    textColor: '#FFFFFF',
    text:
      'Yay! You have received {{action_points}} {{points_unit}} for {{action_description}}.',
  },
  emojiPage: {
    backgroundColor: '#000000',
    backgroundOpacity: 1,
    backgroundHidden: false,
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
  postFormStyles: {
    width: 100,
    position: 'center',
    buttonSize: 100,
    buttonRadius: 0,
    buttonColor: 'pink',
    buttonBackgroundColor: 'blue',
    buttonHoverBackgroundColor: 'blue',
    buttonPosition: 'center',
    buttonFontSize: 27,
    inputStyles: {
      labelColor: '#7d7a7a',
      borderColor: '#7d7a7a',
      backgroundColor: '#7d7a7a',
      backgroundOpacity: 0,
      textColor: '#7d7a7a',
      helperTextColor: '#7d7a7a',
    },
  },
}

export type Header = {}
