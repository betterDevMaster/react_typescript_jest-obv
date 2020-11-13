import {dashboardReducer} from 'organization/Events/Dashboard/state'
import {editorReducer} from 'organization/Events/Dashboard/editor/state'
import {combineReducers} from 'redux'
import {authReducer} from 'auth'

export const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  editor: editorReducer,
  auth: authReducer,
})
