import {Action, useActions} from 'Event/ActionsProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'

export function useSetActive() {
  const activate = useActivate()
  const deactivate = useDeactivate()
  const actions = useActions()

  return (isActive: boolean, action: Action) => {
    const send = isActive ? activate : deactivate
    return send(action).then(actions.update)
  }
}

function useActivate() {
  const update = useUpdateAction()
  return (action: Action) => update(action, {is_active: true})
}

function useDeactivate() {
  const update = useUpdateAction()
  return (action: Action) => update(action, {is_active: false})
}

export function useUpdateAction() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (action: Action, data: Partial<Action>) => {
    const url = api(`/events/${event.slug}/actions/${action.key}`)
    return client.patch<Action>(url, data)
  }
}
