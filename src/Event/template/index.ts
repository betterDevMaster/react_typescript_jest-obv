import {Panels} from 'Event/template/Panels'
import {SimpleBlog} from 'Event/template/SimpleBlog'

/**
 * Base properties shared by all templates
 */
export type BaseTemplate = {
  version: number
  header: Header
}

export type Template = SimpleBlog | Panels

export type Header = {
  script: string | null
}
