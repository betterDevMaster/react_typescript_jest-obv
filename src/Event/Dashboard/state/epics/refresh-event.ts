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

export const refreshEventEpic: Epic<
  RefreshEventAction,
  any,
  RootState,
  {ajax: AjaxCreationMethod}
> = (action$, state$, {ajax}) =>
  action$.pipe(
    ofType<RefreshEventAction>(REFRESH_EVENT_ACTION),
    switchMap(() => {
      const {event} = state$.value
      if (!event) {
        throw new Error('Missing event, was it set properly in EventProvider?')
      }

      const url = api(`/events/${event.slug}`)

      const request = ajax.get(url)
      return request.pipe(map((data) => setEvent(data.response)))
    }),
  )
