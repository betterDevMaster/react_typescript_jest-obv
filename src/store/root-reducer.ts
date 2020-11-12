import {dashboardReducer} from 'organization/event/Dashboard/state'
import {editorReducer} from 'organization/event/Dashboard/editor/state'
import {combineReducers} from 'redux'
import {authReducer} from 'auth'

export const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  editor: editorReducer,
  auth: authReducer,
})
