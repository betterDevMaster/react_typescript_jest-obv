import React, {useEffect} from 'react'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import {User} from 'user'
import DashboardEditDialog from 'editor/views/DashboardEditDialog'
import Template from 'Dashboard/Template'
import EditToggleBar from 'editor/views/EditToggleBar'
import DashboardProvider from 'Dashboard/state/DashboardProvider'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'editor/state/actions'

export type Dashboard = SimpleBlog

export type DashboardProps = {
  dashboard: Dashboard
  user: User
  isEditMode: boolean
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
