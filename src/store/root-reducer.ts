import {dashboardEditorReducer} from 'Dashboard/DashboardEditor/state'
import {combineReducers} from 'redux'

export const rootReducer = combineReducers({
  dashboardEditor: dashboardEditorReducer,
})
