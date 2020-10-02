import {NAV_BUTTON} from 'Dashboard/components/NavButton'

export interface Component {
  isEditMode: boolean
}

// Must register component types here. This ensures wherever
// various component types are handled, that all possible
// components are accounted for.
export type ComponentType = typeof NAV_BUTTON
