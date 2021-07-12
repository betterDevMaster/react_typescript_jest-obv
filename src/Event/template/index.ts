import {Panels} from 'Event/template/Panels'
import {SimpleBlog} from 'Event/template/SimpleBlog'

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

export type Header = {
  script: string | null
}
