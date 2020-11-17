import {authReducer} from 'auth'
import {editorReducer} from 'event/Dashboard/editor/state'
import {dashboardReducer} from 'event/Dashboard/state'
import {saveDashboardEpic} from 'event/Dashboard/state/epics'
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
})
export type RootState = ReturnType<typeof rootReducer>

const epicMiddleware = createEpicMiddleware<any, any, RootState>()

// If devtools is enabled, use devtool's compose. Required
// for proper debugging.
const composeWithDevtools =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// Make creating a store a fn to avoid tests sharing the same store
export const createStore = () =>
  createReduxStore(
    rootReducer,
    composeWithDevtools(applyMiddleware(epicMiddleware)),
  )

const rootEpic = combineEpics(saveDashboardEpic)

// Also a fn to allow being called AFTER store set up
export const runEpics = () => {
  epicMiddleware.run(rootEpic)
}
