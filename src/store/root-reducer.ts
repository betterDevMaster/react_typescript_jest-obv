import {dashboardReducer} from 'organization/user/event/Dashboard/state'
import {editorReducer} from 'organization/user/event/Dashboard/editor/state'
import {combineReducers} from 'redux'
import {authReducer} from 'auth'

export const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  editor: editorReducer,
  auth: authReducer,
})
