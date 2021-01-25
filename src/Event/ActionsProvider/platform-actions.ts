import {isTest} from './../../App'
import {Action, useActions} from 'Event/ActionsProvider'

export const findAction = (id: number, actions: Action[]) =>
  actions.find((a) => a.id === id)

/**
 * Return platform's pre-defined actions. Action ids are hard-coded
 * see API's PlatformAction class for order of actions, and their
 * corresponding ids.
 */
export function usePlatformActions() {
  const {platform} = useActions()

  return {
    CREATE_PASSWORD: logIfMissing(
      'Create password',
      findAction(1, platform.actions),
    ),
    COMPLETE_STEP_2: logIfMissing(
      'Complete Step 2',
      findAction(2, platform.actions),
    ),
    VISIT_DASHBOARD: logIfMissing(
      'Visit dashboard',
      findAction(3, platform.actions),
    ),
    DOWNLOADING_RESOURCE: logIfMissing(
      'Downloading resource',
      findAction(4, platform.actions),
    ),
    VISIT_LEADERBOARD: logIfMissing(
      'Downloading resource',
      findAction(5, platform.actions),
    ),
  }
}

/**
 * Log out an error if we expected a pre-defined platform action, but
 * none was found. Platform actions are pre-seeded, and their ids
 * should never change. This makes sure we know if they do.
 *
 * @param page
 * @param action
 */
function logIfMissing(description: string, action?: Action) {
  if (action) {
    return action
  }

  if (!isTest) {
    console.error(`Could not find platform action: '${description}'.`)
  }

  return null
}
