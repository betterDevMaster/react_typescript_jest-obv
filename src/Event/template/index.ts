import {Points} from 'Event/template/SimpleBlog/Dashboard/PointsSummary'
import {Panels} from 'Event/template/Panels'
import {SimpleBlog} from 'Event/template/SimpleBlog'

/**
 * Base properties shared by all templates
 */
export type BaseTemplate = {
  version: number
  points: Points | null
  header: Header
  disableBackgroundConfig?: boolean
}

export type Template = SimpleBlog | Panels

export type Header = {
  script: string | null
}
