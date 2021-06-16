import {Epic, ofType} from 'redux-observable'
import {RootState} from 'store'
import {switchMap, map} from 'rxjs/operators'
import {api} from 'lib/url'
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'
import {
  RefreshEventAction,
  REFRESH_EVENT_ACTION,
  setEvent,
} from 'Event/state/actions'
import {isAfter} from 'lib/date-time'
import {EMPTY} from 'rxjs'

export const refreshEventEpic: Epic<
  RefreshEventAction,
  any,
  RootState,
  {ajax: AjaxCreationMethod}
> = (action$, state$, {ajax}) =>
  action$.pipe(
    ofType<RefreshEventAction>(REFRESH_EVENT_ACTION),
    switchMap((action) => {
      const {event} = state$.value
      if (!event) {
        throw new Error('Missing event, was it set properly in EventProvider?')
      }

      const hasChanges = isAfter({
        target: action.payload,
        isAfter: event.updated_at,
      })
      if (!hasChanges) {
        console.log('empty!~')
        return EMPTY
      }

      const url = api(`/events/${event.slug}`)

      const request = ajax.get(url)
      return request.pipe(map((data) => setEvent(data.response)))
    }),
  )
