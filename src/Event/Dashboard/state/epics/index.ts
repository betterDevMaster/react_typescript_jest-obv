import {createDashboardEpic} from 'Event/Dashboard/state/epics/create-dashboard'
import {refreshEventEpic} from 'Event/Dashboard/state/epics/refresh-event'
import {combineEpics} from 'redux-observable'

export const dashboardEpics = combineEpics(
  createDashboardEpic,
  refreshEventEpic,
)
