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
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'
import {ajax as rxJsAjax} from 'rxjs/ajax'

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

type StoreOptions = {
  ajax: AjaxCreationMethod
}

// Make creating a store a fn to avoid tests sharing the same store. We'll also
// accept dependencies here.
export const createStore = ({ajax}: StoreOptions = {ajax: rxJsAjax}) => {
  const epicMiddleware = createEpicMiddleware<any, any, RootState>({
    dependencies: {
      ajax,
    },
  })

  const store = createReduxStore(
    rootReducer,
    composeWithDevtools(applyMiddleware(epicMiddleware)),
  )
  epicMiddleware.run(rootEpic)

  return store
}
const rootEpic = combineEpics(saveDashboardEpic)
