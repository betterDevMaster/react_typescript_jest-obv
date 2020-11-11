import {DashboardEditorState} from 'organization/event/Dashboard/editor/state'
import {Config} from 'organization/event/Dashboard/editor/views/DashboardEditDialog/ConfigComponent'

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

export type EditorAction = SetEditModeAction | SetConfigAction
