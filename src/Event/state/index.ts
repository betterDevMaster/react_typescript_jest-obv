import {ObvioEvent} from 'Event'
import {
  CREATE_DASHBOARD_ACTION,
  EventAction,
  handleCreateDashboard,
  handleSetEvent,
  SET_EVENT_ACTION,
} from 'Event/state/actions'

export type EventState = ObvioEvent | null

export function eventReducer(state: EventState = null, action: EventAction) {
  switch (action.type) {
    case SET_EVENT_ACTION: {
      return handleSetEvent(state, action)
    }
    case CREATE_DASHBOARD_ACTION: {
      return handleCreateDashboard(state, action)
    }
    default: {
      return state
    }
  }
}
