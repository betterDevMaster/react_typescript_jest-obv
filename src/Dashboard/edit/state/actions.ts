import {DashboardEditorState} from './index'
import {Dashboard} from 'Dashboard'

export const SET_DASHBOARD_ACTION = 'SET_DASHBOARD_ACTION'
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
  state: DashboardEditorState,
  action: SetDashboardAction,
) => {
  return {
    ...state,
    dashboard: action.payload,
  }
}

export type DashboardEditorAction = SetDashboardAction
