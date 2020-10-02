import {DashboardEditorState} from './index'
import {Dashboard} from 'Dashboard'
import {ComponentType} from 'Dashboard/components'

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

export interface Component {
  type: ComponentType
  id: string
}
export const SET_COMPONENT_ACTION = 'SET_COMPONENT_ACTION'
export interface SetComponentAction {
  type: typeof SET_COMPONENT_ACTION
  payload: Component | null
}
export const setComponent = (
  component: Component | null,
): SetComponentAction => ({
  type: SET_COMPONENT_ACTION,
  payload: component,
})
export const handleSetComponent = (
  state: DashboardEditorState,
  action: SetComponentAction,
) => {
  return {
    ...state,
    component: action.payload,
  }
}

export type DashboardEditorAction = SetDashboardAction | SetComponentAction
