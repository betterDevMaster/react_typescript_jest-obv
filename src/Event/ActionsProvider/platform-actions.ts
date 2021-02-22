import {Action} from 'Event/ActionsProvider'
import {useEvent} from 'Event/EventProvider'

export interface PlatformActions {
  create_password: Action | null
  complete_check_in: Action | null
  visit_dashboard: Action | null
  download_resource: Action | null
  visit_leaderboard: Action | null
}

export const findAction = (id: number, actions: Action[]) =>
  actions.find((a) => a.id === id)

/**
 * Return platform's pre-defined actions. Action ids are hard-coded
 * see API's PlatformAction class for order of actions, and their
 * corresponding ids.
 */
export function usePlatformActions() {
  const {event} = useEvent()

  return {
    createPassword: event.platform_actions.create_password,
    completeCheckIn: event.platform_actions.complete_check_in,
    visitDashboard: event.platform_actions.visit_dashboard,
    downloadResource: event.platform_actions.download_resource,
    visitLeaderboard: event.platform_actions.visit_leaderboard,
  }
}
