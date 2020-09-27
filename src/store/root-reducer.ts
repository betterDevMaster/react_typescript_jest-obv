import {dashboardEditorReducer} from 'Dashboard/edit/state'
import {combineReducers} from 'redux'

export const rootReducer = combineReducers({
  dashboardEditor: dashboardEditorReducer,
})
