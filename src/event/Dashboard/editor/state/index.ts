import {
  EditorAction,
  handleSetConfig,
  handleSetEditMode,
  handlesetSaving,
  SET_CONFIG_ACTION,
  SET_EDIT_MODE,
  SET_SAVING_ACTION,
} from 'event/Dashboard/editor/state/actions'
import {Config} from 'event/Dashboard/editor/views/DashboardEditDialog/ConfigComponent'

export type DashboardEditorState = {
  config: Config | null
  isEditMode: boolean
  isSaving: boolean
}

export const defaultState: DashboardEditorState = {
  config: null,
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
    case SET_CONFIG_ACTION: {
      return handleSetConfig(state, action)
    }
    case SET_SAVING_ACTION: {
      return handlesetSaving(state, action)
    }
    default: {
      return state
    }
  }
}
