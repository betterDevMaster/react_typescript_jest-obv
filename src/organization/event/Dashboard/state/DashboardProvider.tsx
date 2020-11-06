import {Dashboard} from 'organization/event/Dashboard'
import {setDashboard, updateDashboard} from 'organization/event/Dashboard/state/actions'
import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

const DashboardContext = React.createContext(
  (undefined as unknown) as Dashboard,
)

export default function DashboardProvider(props: {
  children: React.ReactNode
  saved: Dashboard
}) {
  const hasSetRef = useRef(false)
  const hasSet = hasSetRef.current
  const dispatch = useDispatch()

  const current = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    if (hasSet) {
      return
    }

    hasSetRef.current = true
    dispatch(setDashboard(props.saved))
  }, [dispatch, hasSet, props.saved])

  const dashboard = current || props.saved

  return (
    <DashboardContext.Provider value={dashboard}>
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
