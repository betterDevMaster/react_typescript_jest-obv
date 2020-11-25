import {
  UpdateDashboardAction,
  UPDATE_DASHBOARD_ACTION,
} from 'Event/Dashboard/state/actions'
import {Epic, ofType} from 'redux-observable'
import {RootState} from 'store'
import {mapTo, debounceTime, switchMap} from 'rxjs/operators'
import {api} from 'lib/url'
import {setSaving} from 'Event/Dashboard/editor/state/actions'
import {of, concat} from 'rxjs'
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'

export const saveDashboardEpic: Epic<
  UpdateDashboardAction,
  any,
  RootState,
  {ajax: AjaxCreationMethod}
> = (action$, state$, {ajax}) =>
  action$.pipe(
    ofType<UpdateDashboardAction>(UPDATE_DASHBOARD_ACTION),
    debounceTime(1000),
    mapTo(setSaving(true)),
    switchMap(() => {
      const {event, dashboard, auth} = state$.value
      if (!event) {
        throw new Error('Missing event, was it set properly in EventProvider?')
      }

      const url = api(`/events/${event.slug}`)

      // Use dependencies.ajax to allow injecting mock ajax for tests
      const request = ajax.post(
        url,
        {
          ...event,
          dashboard,
          _method: 'PUT', // Required to tell Laravel it's a PUT request
        },
        {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json', // Avoid rxjs from serializing data into [object, object]
        },
      )

      // Set saving status after request completes
      return concat(of(setSaving(true)), request.pipe(mapTo(setSaving(false))))
    }),
  )
