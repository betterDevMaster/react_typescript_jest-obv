import {RootState} from './../../../store/index'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import {useSelector} from 'react-redux'

export function usePrimaryColor(isEditMode: boolean, dashboard: SimpleBlog) {
  const currentColor = useSelector(
    (state: RootState) => state.dashboardEditor.primaryColor,
  )

  if (!isEditMode || !currentColor) {
    return dashboard.primaryColor
  }

  return currentColor
}
