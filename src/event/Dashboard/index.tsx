import React, {useEffect} from 'react'
import {SimpleBlog} from 'Event/Dashboard/Template/SimpleBlog'
import {User} from 'auth/user'
import DashboardEditDialog from 'Event/Dashboard/editor/views/DashboardEditDialog'
import Template from 'Event/Dashboard/Template'
import ConfigBar from 'Event/Dashboard/editor/views/ConfigBar'
import DashboardProvider from 'Event/Dashboard/state/DashboardProvider'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'Event/Dashboard/editor/state/actions'

export type Dashboard = SimpleBlog

export type DashboardProps = {
  dashboard: Dashboard | null
  isEditMode?: boolean
  user: User
}

export default function Dashboard(props: DashboardProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setEditMode(props.isEditMode || false))
  }, [props.isEditMode, dispatch])

  if (props.isEditMode) {
    return (
      <DashboardProvider saved={props.dashboard}>
        <ConfigBar />
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
