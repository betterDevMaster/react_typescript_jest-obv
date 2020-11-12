import {Dashboard} from 'organization/event/Dashboard'
import {DashboardState} from 'organization/event/Dashboard/state'

export const SET_DASHBOARD_ACTION = 'SET_DASHBOARD'
export interface SetDashboardAction {
  type: typeof SET_DASHBOARD_ACTION
  payload: Dashboard | null
}
export const setDashboard = (
  dashboard: Dashboard | null,
): SetDashboardAction => ({
  type: SET_DASHBOARD_ACTION,
  payload: dashboard,
})
export const handleSetDashboard = (
  state: DashboardState,
  action: SetDashboardAction,
): DashboardState => {
  if (!action.payload) {
    return action.payload
  }

  if (!state) {
    return action.payload
  }

  return {
    ...state,
    ...action.payload,
  }
}

export const UPDATE_DASHBOARD_ACTION = 'UPDATE_DASHBOARD'
export interface UpdateDashboardAction {
  type: typeof UPDATE_DASHBOARD_ACTION
  payload: Partial<Dashboard>
}
export const updateDashboard = (
  updates: Partial<Dashboard>,
): UpdateDashboardAction => ({
  type: UPDATE_DASHBOARD_ACTION,
  payload: updates,
})
export const handleUpdateDashboard = (
  state: DashboardState,
  action: UpdateDashboardAction,
): DashboardState => {
  if (!state) {
    throw new Error('Dashboard has not been set in store')
  }

  return {
    ...state,
    ...action.payload,
  }
}

export type DashboardAction = SetDashboardAction | UpdateDashboardAction
