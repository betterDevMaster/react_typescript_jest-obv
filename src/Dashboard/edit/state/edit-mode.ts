import {Dashboard} from 'Dashboard'
import {setConfig, setDashboard} from 'Dashboard/edit/state/actions'
import {Config} from 'Dashboard/edit/views/DashboardEditDialog/ConfigComponent'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export const useEditMode = () =>
  useSelector((state: RootState) => state.dashboardEditor.isEditMode)

export function useCurrent<T>(
  currentSelector: (state: RootState) => T | undefined,
  saved: T,
) {
  const current = useSelector(currentSelector)
  const isEditMode = useEditMode()

  // If dashboard not loaded, or does not contain component,
  // value will be undefined. This is different from
  // 'null'/false/0 case, which are valid values.
  if (!isEditMode || current === undefined) {
    return saved
  }

  return current
}

export function useCloseConfig() {
  const dispatch = useDispatch()
  return () => {
    dispatch(setConfig(null))
  }
}

export function useUpdateDashboard() {
  const dispatch = useDispatch()

  return (updates: Partial<Dashboard | null>) => {
    dispatch(setDashboard(updates))
  }
}

export function useEditComponent(component: Config) {
  const dispatch = useDispatch()

  return () => {
    dispatch(setConfig(component))
  }
}
