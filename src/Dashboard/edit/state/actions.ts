import {DashboardEditorState, defaultState} from 'Dashboard/edit/state'
import {Dashboard} from 'Dashboard'
import {Config} from 'Dashboard/edit/views/DashboardEditDialog/ConfigComponent'

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

export const SET_CONFIG_ACTION = 'SET_CONFIG'
export interface SetConfigAction {
  type: typeof SET_CONFIG_ACTION
  payload: Config | null
}
export const setConfig = (config: Config | null): SetConfigAction => ({
  type: SET_CONFIG_ACTION,
  payload: config,
})
export const handleSetConfig = (
  state: DashboardEditorState,
  action: SetConfigAction,
) => {
  return {
    ...state,
    config: action.payload,
  }
}

export type DashboardEditorAction =
  | SetEditModeAction
  | SetDashboardAction
  | SetConfigAction
