import {Panels} from 'Event/template/Panels'
import {SimpleBlog} from 'Event/template/SimpleBlog'
import {DeepRequired} from 'lib/type-utils'

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
    background?: string
  }

  imageWaterfall?: {
    title?: string
    description?: string
    backToDashboardText?: string
    backToDashboardTextColor?: string
    uploadFormTitle?: string
    uploadFormDescription?: string
    uploadButtonText?: string
    uploadButtonFontSize?: number
    uploadButtonBorderRadius?: number
    uploadButtonTextColor?: string
    uploadButtonBackgroundColor?: string
    uploadButtonBorderColor?: string
    actionId?: string | null
  }
}

export type Template = SimpleBlog | Panels

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
    background: '#000000',
  },
  imageWaterfall: {
    title: 'Image Waterfall',
    description: 'Image Waterfall',
    backToDashboardText: 'Back to Dashboard',
    backToDashboardTextColor: '#000000',
    uploadFormTitle: 'Upload Image',
    uploadFormDescription: 'Upload Waterfall Image',
    uploadButtonText: 'Upload',
    uploadButtonFontSize: 12,
    uploadButtonBorderRadius: 0,
    uploadButtonTextColor: '#000000',
    uploadButtonBackgroundColor: '#FFFFFF',
    uploadButtonBorderColor: '#000000',
    actionId: null,
  },
}

export type Header = {}
