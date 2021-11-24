import {ObvioEvent} from 'Event'
import {
  EventAction,
  handleCreateTemplate,
  handleSetEvent,
  CREATE_TEMPLATE_ACTION,
  SET_EVENT_ACTION,
  SET_EVENT_UPDATED_AT_ACTION,
  handleSetEventUpdatedAt,
} from 'Event/state/actions'

export type EventState = ObvioEvent | null

export function eventReducer(state: EventState = null, action: EventAction) {
  switch (action.type) {
    case SET_EVENT_ACTION: {
      return handleSetEvent(state, action)
    }
    case CREATE_TEMPLATE_ACTION: {
      return handleCreateTemplate(state, action)
    }
    case SET_EVENT_UPDATED_AT_ACTION: {
      return handleSetEventUpdatedAt(state, action)
    }
    default: {
      return state
    }
  }
}
