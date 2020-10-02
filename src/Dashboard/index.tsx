import React, {useEffect, useRef} from 'react'
import {
  SimpleBlogDashboard,
  SIMPLE_BLOG,
  SimpleBlog,
} from 'Dashboard/templates/SimpleBlog'
import {User} from 'user'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {setDashboard} from 'Dashboard/edit/state/actions'
import DashboardEditDialog from 'Dashboard/edit/views/DashboardEditDialog'

export type Dashboard = SimpleBlogDashboard
interface DashboardProps {
  dashboard: Dashboard
  user: User
  isEditMode: boolean
}

export default function Dashboard(props: DashboardProps) {
  const dashboard = useCurrentDashboard(props.isEditMode, props.dashboard)
  if (!dashboard) {
    return null
  }

  const dashboardComponent = DashboardComponent({
    ...props,
    dashboard,
  })

  if (props.isEditMode) {
    return (
      <>
        {dashboardComponent}
        <DashboardEditDialog />
      </>
    )
  }

  return dashboardComponent
}

function useCurrentDashboard(
  isEditMode: boolean,
  saved: Dashboard,
): Dashboard | null {
  const dispatch = useDispatch()
  const loadedRef = useRef(false)
  const updated = useSelector(
    (state: RootState) => state.dashboardEditor.dashboard,
  )

  useEffect(() => {
    const shouldSetDashboardToEdit = isEditMode && !loadedRef.current
    if (!shouldSetDashboardToEdit) {
      return
    }

    loadedRef.current = true
    dispatch(setDashboard(saved))
  }, [dispatch, isEditMode, saved])

  if (!isEditMode) {
    return saved
  }

  if (!updated) {
    return null
  }

  return updated
}

function DashboardComponent(props: DashboardProps) {
  switch (props.dashboard.template) {
    case SIMPLE_BLOG:
      return (
        <SimpleBlog
          dashboard={props.dashboard}
          user={props.user}
          isEditMode={props.isEditMode}
        />
      )
    default:
      // Need to handle undefined case explicitly, because the dashboard could
      // have been bound globally (via Laravel), and there's no way to
      // verify the type at this point.
      throw new Error(
        //@ts-ignore
        `Missing component for template: ${dashboard.template}`,
      )
  }
}
