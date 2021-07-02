import {
  EditorAction,
  handleSetEditMode,
  handlesetSaving,
  SET_EDIT_MODE,
  SET_SAVING_ACTION,
} from 'Event/Dashboard/editor/state/actions'

export type DashboardEditorState = {
  isEditMode: boolean
  isSaving: boolean
}

export const defaultState: DashboardEditorState = {
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
      return handlesetSaving(state, action)
    }
    default: {
      return state
    }
  }
}
