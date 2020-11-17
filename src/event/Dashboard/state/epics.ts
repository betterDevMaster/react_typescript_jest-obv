import {
  UpdateDashboardAction,
  UPDATE_DASHBOARD_ACTION,
} from 'event/Dashboard/state/actions'
import {Epic, ofType} from 'redux-observable'
import {RootState} from 'store'
import {tap, mapTo, debounceTime} from 'rxjs/operators'

export const saveDashboardEpic: Epic<
  UpdateDashboardAction,
  any,
  RootState,
  any
> = (action$, state$) =>
  action$.pipe(
    ofType<UpdateDashboardAction>(UPDATE_DASHBOARD_ACTION),
    debounceTime(1000),
    // switchMap((action) => {
    //   state$.value.dashboard
    //   const url = api('/events/')
    //   return ajax.post()
    // }),
    tap(console.log),
    mapTo({
      type: 'test',
    }),
  )
