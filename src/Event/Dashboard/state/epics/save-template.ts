import {Epic, ofType} from 'redux-observable'
import {RootState} from 'store'
import {debounceTime, switchMap, map} from 'rxjs/operators'
import {api} from 'lib/url'
import {setSaving} from 'Event/Dashboard/editor/state/actions'
import {of, concat} from 'rxjs'
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'
import {
  setEvent,
  UpdateTemplateAction,
  UPDATE_TEMPLATE_ACTION,
} from 'Event/state/actions'

export const saveTemplateEpic: Epic<
  UpdateTemplateAction,
  any,
  RootState,
  {ajax: AjaxCreationMethod}
> = (action$, state$, {ajax}) =>
  action$.pipe(
    ofType<UpdateTemplateAction>(UPDATE_TEMPLATE_ACTION),
    debounceTime(1000),
    switchMap(() => {
      const {event, auth} = state$.value
      if (!event) {
        throw new Error('Missing event, was it set properly in EventProvider?')
      }

      /**
       * Do NOT send image property data, or we'll run into a
       * 'property should be a file' 422 error.
       */

      const {
        logo,
        points_summary_logo,
        header_background,
        dashboard_background,
        login_background,
        login_logo,
        welcome_image,
        sidebar_background,
        footer_image,
        favicon,
        sponsor_question_icon,
        mobile_logo,
        ...update
      } = event

      const url = api(`/events/${event.slug}`)

      // Use dependencies.ajax to allow injecting mock ajax for tests
      const request = ajax.post(
        url,
        {
          ...update,
          _method: 'PUT', // Required to tell Laravel it's a PUT request
        },
        {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json', // Avoid rxjs from serializing data into [object, object]
        },
      )

      // Set saving status after request completes
      return concat(
        of(setSaving(true)),
        request.pipe(
          map((data) =>
            setEvent({
              ...update,
              ...data.response,
              /**
               * Use local template to always show latest changes. This prevents typed
               * text from disappearing when the event is resolved.
               */
              template: update.template,
            }),
          ),
        ),
        of(setSaving(false)),
      )
    }),
  )
