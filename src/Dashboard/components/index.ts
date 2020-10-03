import {MAIN_NAV_BUTTON} from 'Dashboard/Template/SimpleBlog/MainNavButton'

export interface Component {
  isEditMode?: boolean
}

// Must register component types here. This ensures wherever
// various component types are handled, that all possible
// components are accounted for.
export type ComponentType = typeof MAIN_NAV_BUTTON
