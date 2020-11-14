import {Dashboard} from 'organization/Events/Dashboard'
import {
  setDashboard,
  updateDashboard,
} from 'organization/Events/Dashboard/state/actions'
import {createSimpleBlog} from 'organization/Events/Dashboard/Template/SimpleBlog'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

const DashboardContext = React.createContext<Dashboard | undefined>(undefined)

export default function DashboardProvider(props: {
  children: React.ReactNode
  saved: Dashboard | null
}) {
  const dispatch = useDispatch()
  const current = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    const dashboard = props.saved || createSimpleBlog()
    dispatch(setDashboard(dashboard))
  }, [dispatch, props.saved])

  if (!current) {
    return null
  }

  return (
    <DashboardContext.Provider value={current}>
      {props.children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = React.useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }

  return context
}

export function useUpdateDashboard() {
  const dispatch = useDispatch()

  return (updates: Partial<Dashboard>) => {
    dispatch(updateDashboard(updates))
  }
}
