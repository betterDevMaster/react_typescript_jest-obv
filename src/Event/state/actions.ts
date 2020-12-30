import {createSimpleBlog} from './../template/SimpleBlog/index'
import {ObvioEvent} from 'Event'
import {EventState} from 'Event/state'
import {Template} from 'Event/template'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

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

export const CREATE_TEMPLATE_ACTION = 'CREATE_TEMPLATE'
export interface CreateTemplateAction {
  type: typeof CREATE_TEMPLATE_ACTION
  payload: Template['name']
}
export const createTemplate = (
  template: Template['name'],
): CreateTemplateAction => ({
  type: CREATE_TEMPLATE_ACTION,
  payload: template,
})
export const handleCreateTemplate = (
  state: EventState,
  action: CreateTemplateAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  const template = newTemplate(action.payload)
  return {
    ...state,
    template,
  }
}
function newTemplate(name: Template['name']) {
  switch (name) {
    case SIMPLE_BLOG:
      return createSimpleBlog()
  }
}

export const UPDATE_TEMPLATE_ACTION = 'UPDATE_TEMPLATE'
export interface UpdateDashboardAction {
  type: typeof UPDATE_TEMPLATE_ACTION
  payload: Partial<Template>
}
export const updateDashboard = (
  updates: Partial<Template>,
): UpdateDashboardAction => ({
  type: UPDATE_TEMPLATE_ACTION,
  payload: updates,
})
export const handleUpdateDashboard = (
  state: EventState,
  action: UpdateDashboardAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  if (!state.template) {
    throw new Error('Template missing; create one before updating')
  }

  return {
    ...state,
    template: {
      ...state.template,
      ...action.payload,
    },
  }
}

export type EventAction =
  | SetEventAction
  | CreateTemplateAction
  | UpdateDashboardAction
