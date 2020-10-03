import {Dashboard} from 'Dashboard'
import {
  Component,
  DashboardEditorAction,
  handleSetComponent,
  handleSetDashboard,
  SET_COMPONENT_ACTION,
  SET_DASHBOARD_ACTION,
} from 'Dashboard/edit/state/actions'

export type DashboardEditorState = Partial<Dashboard> & {
  component: Component | null
}

export const defaultState: DashboardEditorState = {
  component: null,
}

export function dashboardEditorReducer(
  state: DashboardEditorState = defaultState,
  action: DashboardEditorAction,
) {
  switch (action.type) {
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
