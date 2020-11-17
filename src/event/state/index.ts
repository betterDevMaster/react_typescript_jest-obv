import {ObvioEvent} from 'event'

import {
  EventAction,
  handleSetEvent,
  SET_EVENT_ACTION,
} from 'event/state/actions'

export type EventState = ObvioEvent | null

export function eventReducer(state: EventState = null, action: EventAction) {
  switch (action.type) {
    case SET_EVENT_ACTION: {
      return handleSetEvent(state, action)
    }
    default: {
      return state
    }
  }
}
