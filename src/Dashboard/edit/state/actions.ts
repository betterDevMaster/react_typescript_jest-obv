import {DashboardEditorState, defaultState} from 'Dashboard/edit/state'
import {Dashboard} from 'Dashboard'
import {ComponentType} from 'Dashboard/components'

export const SET_EDIT_MODE = 'SET_EDIT_MODE'
export interface SetEditModeAction {
  type: typeof SET_EDIT_MODE
  payload: boolean
}
export const setEditMode = (isEdit: boolean): SetEditModeAction => ({
  type: SET_EDIT_MODE,
  payload: isEdit,
})
export const handleSetEditMode = (
  state: DashboardEditorState,
  action: SetEditModeAction,
): DashboardEditorState => ({
  ...state,
  isEditMode: action.payload,
})

export const SET_DASHBOARD_ACTION = 'SET_DASHBOARD'
export interface SetDashboardAction {
  type: typeof SET_DASHBOARD_ACTION
  payload: Partial<Dashboard> | null
}
export const setDashboard = (
  dashboard: Partial<Dashboard> | null,
): SetDashboardAction => ({
  type: SET_DASHBOARD_ACTION,
  payload: dashboard,
})
export const handleSetDashboard = (
  state: DashboardEditorState,
  action: SetDashboardAction,
): DashboardEditorState => {
  const resetDashboardEdit = !action.payload
  if (resetDashboardEdit) {
    return defaultState
  }

  return {
    ...state,
    ...action.payload,
  }
}

export interface Component {
  type: ComponentType
  id?: string
}
export const SET_COMPONENT_ACTION = 'SET_COMPONENT'
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

export type DashboardEditorAction =
  | SetEditModeAction
  | SetDashboardAction
  | SetComponentAction
