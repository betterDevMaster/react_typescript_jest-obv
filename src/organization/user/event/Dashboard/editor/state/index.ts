import {
  EditorAction,
  handleSetConfig,
  handleSetEditMode,
  SET_CONFIG_ACTION,
  SET_EDIT_MODE,
} from 'organization/user/event/Dashboard/editor/state/actions'
import {Config} from 'organization/user/event/Dashboard/editor/views/DashboardEditDialog/ConfigComponent'

export type DashboardEditorState = {
  config: Config | null
  isEditMode: boolean
}

export const defaultState: DashboardEditorState = {
  config: null,
  isEditMode: false,
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
    default: {
      return state
    }
  }
}
