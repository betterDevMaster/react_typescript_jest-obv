import {Action, useActions} from 'Event/ActionsProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'

export function useSetActive() {
  const setPlatformActive = useSetPlatformActive()
  const setCustomActive = useSetCustomActive()

  return (isActive: boolean, action: Action) => {
    if (action.is_platform_action) {
      return setPlatformActive(isActive, action)
    }

    return setCustomActive(isActive, action)
  }
}

function useSetPlatformActive() {
  const activate = useActivatePlatformAction()
  const deactivate = useDeactivatePlatformAction()
  const {platform} = useActions()

  return (isActive: boolean, action: Action) => {
    const send = isActive ? activate : deactivate
    return send(action).then(platform.update)
  }
}

function useSetCustomActive() {
  const activate = useActivateCustomAction()
  const deactivate = useDeactivateCustomAction()
  const {custom} = useActions()

  return (isActive: boolean, action: Action) => {
    const send = isActive ? activate : deactivate
    return send(action).then(custom.update)
  }
}

function useActivatePlatformAction() {
  const {client} = useOrganization()
  const {event} = useEvent()

  return (action: Action) => {
    const url = api(
      `/events/${event.slug}/actions/platform/${action.id}/activate`,
    )

    return client.post<Action>(url)
  }
}

function useDeactivatePlatformAction() {
  const {client} = useOrganization()
  const {event} = useEvent()

  return (action: Action) => {
    const url = api(
      `/events/${event.slug}/actions/platform/${action.id}/deactivate`,
    )

    return client.delete<Action>(url)
  }
}

function useActivateCustomAction() {
  const update = useUpdateAction()
  return (action: Action) => update(action, {is_active: true})
}

function useDeactivateCustomAction() {
  const update = useUpdateAction()
  return (action: Action) => update(action, {is_active: false})
}

export function useUpdateAction() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (action: Action, data: Partial<Action>) => {
    const url = api(`/events/${event.slug}/actions/${action.id}`)
    return client.patch<Action>(url, data)
  }
}
