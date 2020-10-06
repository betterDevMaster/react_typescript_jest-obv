import {createStore as createReduxStore} from 'redux'
import {rootReducer} from 'store/root-reducer'

export type RootState = ReturnType<typeof rootReducer>
export const createStore = () =>
  createReduxStore(
    rootReducer,
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      //@ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
