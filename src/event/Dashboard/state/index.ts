import {Dashboard} from 'event/Dashboard'
import {
  DashboardAction,
  handleSetDashboard,
  handleUpdateDashboard,
  SET_DASHBOARD_ACTION,
  UPDATE_DASHBOARD_ACTION,
} from 'event/Dashboard/state/actions'

export type DashboardState = Dashboard | null

export function dashboardReducer(
  state: DashboardState = null,
  action: DashboardAction,
) {
  switch (action.type) {
    case SET_DASHBOARD_ACTION: {
      return handleSetDashboard(state, action)
    }
    case UPDATE_DASHBOARD_ACTION: {
      return handleUpdateDashboard(state, action)
    }
    default: {
      return state
    }
  }
}
