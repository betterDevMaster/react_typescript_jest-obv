import {Dashboard} from 'Dashboard'
import {
  DashboardEditorAction,
  handleSetDashboard,
  SET_DASHBOARD_ACTION,
} from 'Dashboard/DashboardEditor/state/actions'

export interface DashboardEditorState {
  dashboard: Dashboard | null
}

const defaultState: DashboardEditorState = {
  dashboard: null,
}

export function dashboardEditorReducer(
  state: DashboardEditorState = defaultState,
  action: DashboardEditorAction,
) {
  switch (action.type) {
    case SET_DASHBOARD_ACTION: {
      return handleSetDashboard(state, action)
    }
    default: {
      return state
    }
  }
}
