import {authReducer} from 'auth'
import {editorReducer} from 'event/Dashboard/editor/state'
import {dashboardReducer} from 'event/Dashboard/state'
import {saveDashboardEpic} from 'event/Dashboard/state/epics'
import {eventReducer} from 'event/state'
import {
  createStore as createReduxStore,
  applyMiddleware,
  compose,
  combineReducers,
} from 'redux'
import {combineEpics, createEpicMiddleware} from 'redux-observable'

export const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  editor: editorReducer,
  auth: authReducer,
  event: eventReducer,
})
export type RootState = ReturnType<typeof rootReducer>

// If devtools is enabled, use devtool's compose. Required
// for proper debugging.
const composeWithDevtools =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// Make creating a store a fn to avoid tests sharing the same store
export const createStore = () => {
  const epicMiddleware = createEpicMiddleware<any, any, RootState>()
  const store = createReduxStore(
    rootReducer,
    composeWithDevtools(applyMiddleware(epicMiddleware)),
  )
  epicMiddleware.run(rootEpic)

  return store
}
const rootEpic = combineEpics(saveDashboardEpic)
