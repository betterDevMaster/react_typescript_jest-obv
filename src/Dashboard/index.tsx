import React, {useEffect, useRef} from 'react'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import {User} from 'user'
import {useDispatch} from 'react-redux'
import {setDashboard, setEditMode} from 'Dashboard/edit/state/actions'
import DashboardEditDialog from 'Dashboard/edit/views/DashboardEditDialog'
import Template from 'Dashboard/Template'

export type Dashboard = SimpleBlog

export type DashboardProps = {
  dashboard: Dashboard
  user: User
  isEditMode: boolean
}

export default function Dashboard(props: DashboardProps) {
  useLoadDashboard(props.isEditMode, props.dashboard)

  if (props.isEditMode) {
    return (
      <>
        <Template {...props} />
        <DashboardEditDialog />
      </>
    )
  }

  return <Template {...props} />
}

function useLoadDashboard(isEditMode: boolean, dashboard: Dashboard) {
  const hasSetRef = useRef(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setEditMode(isEditMode))
  }, [dispatch, isEditMode])

  useEffect(() => {
    const shouldSetDashboardToEdit = isEditMode && !hasSetRef.current
    if (!shouldSetDashboardToEdit) {
      return
    }

    hasSetRef.current = true
    dispatch(setDashboard(dashboard))
  }, [dispatch, isEditMode, dashboard])

  return hasSetRef.current
}
