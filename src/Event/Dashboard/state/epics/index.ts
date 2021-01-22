import {createDashboardEpic} from 'Event/Dashboard/state/epics/create-dashboard'
import {saveTemplateEpic} from 'Event/Dashboard/state/epics/save-template'
import {combineEpics} from 'redux-observable'

export const dashboardEpics = combineEpics(
  saveTemplateEpic,
  createDashboardEpic,
)
