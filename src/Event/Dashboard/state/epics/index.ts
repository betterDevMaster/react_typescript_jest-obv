import {createDashboardEpic} from 'Event/Dashboard/state/epics/create-dashboard'
import {saveDashboardEpic} from 'Event/Dashboard/state/epics/save-dashboard'
import {combineEpics} from 'redux-observable'

export const dashboardEpics = combineEpics(
  saveDashboardEpic,
  createDashboardEpic,
)
