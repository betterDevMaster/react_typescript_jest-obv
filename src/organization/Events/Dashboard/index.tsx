import React, {useEffect} from 'react'
import {SimpleBlog} from 'organization/Events/Dashboard/Template/SimpleBlog'
import {User} from 'auth/user'
import DashboardEditDialog from 'organization/Events/Dashboard/editor/views/DashboardEditDialog'
import Template from 'organization/Events/Dashboard/Template'
import EditToggleBar from 'organization/Events/Dashboard/editor/views/EditToggleBar'
import DashboardProvider from 'organization/Events/Dashboard/state/DashboardProvider'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'organization/Events/Dashboard/editor/state/actions'

export type Dashboard = SimpleBlog

export type DashboardProps = {
  dashboard: Dashboard | null
  isEditMode: boolean
  user: User
}

export default function Dashboard(props: DashboardProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setEditMode(props.isEditMode))
  }, [props.isEditMode, dispatch])

  if (props.isEditMode) {
    return (
      <DashboardProvider saved={props.dashboard}>
        <EditToggleBar />
        <Template {...props} />
        <DashboardEditDialog />
      </DashboardProvider>
    )
  }

  return (
    <DashboardProvider saved={props.dashboard}>
      <Template {...props} />
    </DashboardProvider>
  )
}
