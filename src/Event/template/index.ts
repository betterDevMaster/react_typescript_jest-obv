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
}

export type Header = {}
