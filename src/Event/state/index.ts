import {ObvioEvent} from 'Event'
import {
  CREATE_TEMPLATE_ACTION,
  EventAction,
  handleCreateTemplate,
  handleSetEvent,
  handleUpdateTemplate,
  SET_EVENT_ACTION,
  UPDATE_TEMPLATE_ACTION,
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
    case UPDATE_TEMPLATE_ACTION: {
      return handleUpdateTemplate(state, action)
    }
    default: {
      return state
    }
  }
}
