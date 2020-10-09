import {Dashboard} from 'Dashboard'
import {
  Component,
  DashboardEditorAction,
  handleSetComponent,
  handleSetDashboard,
  handleSetEditMode,
  SET_COMPONENT_ACTION,
  SET_DASHBOARD_ACTION,
  SET_EDIT_MODE,
} from 'Dashboard/edit/state/actions'

export type DashboardEditorState = Partial<Dashboard> & {
  component: Component | null
  isEditMode: boolean
}

export const defaultState: DashboardEditorState = {
  component: null,
  isEditMode: false,
}

export function dashboardEditorReducer(
  state: DashboardEditorState = defaultState,
  action: DashboardEditorAction,
) {
  switch (action.type) {
    case SET_EDIT_MODE: {
      return handleSetEditMode(state, action)
    }
    case SET_DASHBOARD_ACTION: {
      return handleSetDashboard(state, action)
    }
    case SET_COMPONENT_ACTION: {
      return handleSetComponent(state, action)
    }
    default: {
      return state
    }
  }
}
