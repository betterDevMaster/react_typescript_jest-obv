import {
  EditorAction,
  handleSetEditMode,
  handleSetIsConnected,
  handleSetSaving,
  SET_EDIT_MODE,
  SET_IS_CONNECTED,
  SET_SAVING_ACTION,
} from 'Event/Dashboard/editor/state/actions'

export type DashboardEditorState = {
  isEditMode: boolean
  isSaving: boolean
  isConnected: boolean
}

export const defaultState: DashboardEditorState = {
  isConnected: true,
  isEditMode: false,
  isSaving: false,
}

export function editorReducer(
  state: DashboardEditorState = defaultState,
  action: EditorAction,
) {
  switch (action.type) {
    case SET_EDIT_MODE: {
      return handleSetEditMode(state, action)
    }
    case SET_SAVING_ACTION: {
      return handleSetSaving(state, action)
    }
    case SET_IS_CONNECTED:
      return handleSetIsConnected(state, action)
    default: {
      return state
    }
  }
}
