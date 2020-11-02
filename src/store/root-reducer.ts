import {dashboardReducer} from 'Dashboard/state'
import {editorReducer} from 'editor/state'
import {combineReducers} from 'redux'

export const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  editor: editorReducer,
})
