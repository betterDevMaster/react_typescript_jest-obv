import {Dashboard} from 'Dashboard'
import {
  DashboardEditorAction,
  handleSetConfig,
  handleSetDashboard,
  handleSetEditMode,
  SET_CONFIG_ACTION,
  SET_DASHBOARD_ACTION,
  SET_EDIT_MODE,
} from 'Dashboard/edit/state/actions'
import {Config} from 'Dashboard/edit/views/DashboardEditDialog/ConfigComponent'

export type DashboardEditorState = Partial<Dashboard> & {
  config: Config | null
  isEditMode: boolean
}

export const defaultState: DashboardEditorState = {
  config: null,
  isEditMode: false,
}

export function dashboardEditorReducer(
  state: DashboardEditorState = defaultState,
  action: DashboardEditorAction,
) {
  switch (action.type) {
    case SET_EDIT_MODE: {
      return handleSetEditMode(state, action)
    }
    case SET_DASHBOARD_ACTION: {
      return handleSetDashboard(state, action)
    }
    case SET_CONFIG_ACTION: {
      return handleSetConfig(state, action)
    }
    default: {
      return state
    }
  }
}
