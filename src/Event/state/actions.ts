import {ObvioEvent} from 'Event'
import {EventState} from 'Event/state'
import {Template} from 'Event/template'
import {createPanels, PANELS} from 'Event/template/Panels'
import {createSimpleBlog, SIMPLE_BLOG} from 'Event/template/SimpleBlog'

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
  return action.payload || null // Have to return `null` in case undefined
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
    case PANELS:
      return createPanels()
  }
}

export const UPDATE_TEMPLATE_ACTION = 'UPDATE_TEMPLATE'
export interface UpdateTemplateAction {
  type: typeof UPDATE_TEMPLATE_ACTION
  payload: Partial<Template>
}
export const updateTemplate = (
  updates: Partial<Template>,
): UpdateTemplateAction => ({
  type: UPDATE_TEMPLATE_ACTION,
  payload: updates,
})
export const handleUpdateTemplate = (
  state: EventState,
  action: UpdateTemplateAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  if (!state.template) {
    throw new Error('Template missing; create one before updating')
  }

  /**
   * Need to explicitly cast to EventState here as TS will complain that
   * it can't determine the specific template type. We'll assume this
   * is safe as the user will only ever edit the current template.
   */
  return {
    ...state,
    template: {
      ...state.template,
      ...action.payload,
    },
  } as EventState
}
export interface ClickedEmoji {
  id: number | null
  name: string | null
}

export const SEND_EMOJI_ACTION = 'SEND_EMOJI'
export interface SendEmojiAction {
  type: typeof SEND_EMOJI_ACTION
  payload: ClickedEmoji
}
export const sendEmoji = (emoji: ClickedEmoji): SendEmojiAction => ({
  type: SEND_EMOJI_ACTION,
  payload: emoji,
})

export const REFRESH_EVENT_ACTION = 'REFRESH_EVENT'
export interface RefreshEventAction {
  type: typeof REFRESH_EVENT_ACTION
  payload: string
}
export const refreshEvent = (updatedAt: string): RefreshEventAction => ({
  type: REFRESH_EVENT_ACTION,
  payload: updatedAt,
})

export const SET_EVENT_UPDATED_AT_ACTION = 'SET_EVENT_UPDATED_AT'
export interface SetEventUpdatedAtAction {
  type: typeof SET_EVENT_UPDATED_AT_ACTION
  payload: string
}
export const setEventUpdatedAt = (
  updated_at: string,
): SetEventUpdatedAtAction => ({
  type: SET_EVENT_UPDATED_AT_ACTION,
  payload: updated_at,
})
export const handleSetEventUpdatedAt = (
  state: EventState,
  action: SetEventUpdatedAtAction,
): EventState => {
  if (!state) {
    return state
  }

  return {
    ...state,
    updated_at: action.payload,
  }
}

export type EventAction =
  | SetEventAction
  | CreateTemplateAction
  | UpdateTemplateAction
  | SendEmojiAction
  | RefreshEventAction
  | SetEventUpdatedAtAction
