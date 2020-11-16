import {dashboardReducer} from 'event/Dashboard/state'
import {editorReducer} from 'event/Dashboard/editor/state'
import {combineReducers} from 'redux'
import {authReducer} from 'auth'

export const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  editor: editorReducer,
  auth: authReducer,
})
