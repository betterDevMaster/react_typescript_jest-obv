import {ObvioEvent} from 'Event'
import {Dashboard} from 'Event/Dashboard'
import {
  createSimpleBlog,
  SIMPLE_BLOG,
} from 'Event/Dashboard/Template/SimpleBlog'
import {EventState} from 'Event/state'

export const SET_EVENT_ACTION = 'SET_EVENT'
export interface SetEventAction {
  type: typeof SET_EVENT_ACTION
  payload: ObvioEvent | null
}
export const setEvent = (Event: ObvioEvent | null): SetEventAction => ({
  type: SET_EVENT_ACTION,
  payload: Event,
})
export const handleSetEvent = (
  state: EventState,
  action: SetEventAction,
): EventState => {
  return action.payload
}

export const CREATE_DASHBOARD_ACTION = 'CREATE_DASHBOARD'
export interface CreateDashboardAction {
  type: typeof CREATE_DASHBOARD_ACTION
  payload: Dashboard['template']
}
export const createDashboard = (
  template: Dashboard['template'],
): CreateDashboardAction => ({
  type: CREATE_DASHBOARD_ACTION,
  payload: template,
})
export const handleCreateDashboard = (
  state: EventState,
  action: CreateDashboardAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  const dashboard = newDashboardFromTemplate(action.payload)
  return {
    ...state,
    dashboard,
  }
}
function newDashboardFromTemplate(template: Dashboard['template']) {
  switch (template) {
    case SIMPLE_BLOG:
      return createSimpleBlog()
  }
}

export type EventAction = SetEventAction | CreateDashboardAction
