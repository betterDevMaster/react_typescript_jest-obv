import {createDashboardEpic} from 'Event/Dashboard/state/epics/create-dashboard'
import {refreshEventEpic} from 'Event/Dashboard/state/epics/refresh-event'
import {saveTemplateEpic} from 'Event/Dashboard/state/epics/save-template'
import {combineEpics} from 'redux-observable'

export const dashboardEpics = combineEpics(
  saveTemplateEpic,
  createDashboardEpic,
  refreshEventEpic,
)
