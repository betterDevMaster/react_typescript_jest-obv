import {Epic, ofType} from 'redux-observable'
import {v4 as uuid} from 'uuid'
import {RootState} from 'store'
import {switchMap, map, filter} from 'rxjs/operators'
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
    /**
     * Filter to ignore updates if currently saving. If we're in the middle of
     * a save, we can't be sure which timestamp is correct, so we'll assume
     * ours is the correct state. This fixes the bug where multiple
     * saves results in deleted buttons re-appearing.
     */
    filter(() => !state$.value.editor.isSaving),
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
        return EMPTY
      }

      /**
       * Re-fetch event, we have to make sure to include `No-Cache` header to avoid
       * browser/cdn from returning stale data.
       */
      const url = api(`/events/${event.slug}?no-cache=true`)
      const request = ajax.get(url, {
        'No-Cache': uuid(),
      })

      return request.pipe(map((data) => setEvent(data.response)))
    }),
  )
