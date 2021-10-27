import {Epic, ofType} from 'redux-observable'
import {RootState} from 'store'
import {catchError, map, mapTo, switchMap} from 'rxjs/operators'
import {api} from 'lib/url'
import {setIsConnected, setSaving} from 'Event/Dashboard/editor/state/actions'
import {of, concat} from 'rxjs'
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'
import {
  CreateTemplateAction,
  CREATE_TEMPLATE_ACTION,
  setEventUpdatedAt,
} from 'Event/state/actions'
import {jsonHeader, put} from 'lib/api-client'

export const createDashboardEpic: Epic<
  CreateTemplateAction,
  any,
  RootState,
  {ajax: AjaxCreationMethod}
> = (action$, state$, {ajax}) =>
  action$.pipe(
    ofType<CreateTemplateAction>(CREATE_TEMPLATE_ACTION),
    mapTo(setSaving(true)),
    switchMap(() => {
      const {event, auth} = state$.value
      if (!event) {
        throw new Error('Missing event, was it set properly in EventProvider?')
      }

      const url = api(`/events/${event.slug}`)

      const request = ajax.post(url, put(event), jsonHeader(auth.token))

      // Set saving status after request completes
      return concat(
        of(setSaving(true)),
        request.pipe(
          map((data) => setEventUpdatedAt(data.response.updated_at)),
          catchError(() => of(setIsConnected(false))),
        ),
        of(setSaving(false)),
      )
    }),
  )
