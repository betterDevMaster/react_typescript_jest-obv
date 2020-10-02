import {Dashboard} from 'Dashboard'
import {setDashboard} from 'Dashboard/edit/state/actions'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export const useDashboard = () => {
  const dashboard = useSelector(
    (state: RootState) => state.dashboardEditor.dashboard,
  )

  if (!dashboard) {
    throw new Error('Missing dashboard in editor')
  }

  return dashboard
}

export const useUpdateDashboard = () => {
  const dashboard = useDashboard()
  const dispatch = useDispatch()

  return (updates: Partial<Dashboard>) => {
    dispatch(
      setDashboard({
        ...dashboard,
        ...updates,
      }),
    )
  }
}
