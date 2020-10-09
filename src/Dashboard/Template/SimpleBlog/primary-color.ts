import {RootState} from './../../../store/index'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import {useSelector} from 'react-redux'
import {useEditMode} from 'Dashboard/edit/state/edit-mode'

export function usePrimaryColor(dashboard: SimpleBlog) {
  const isEditMode = useEditMode()
  const currentColor = useSelector(
    (state: RootState) => state.dashboardEditor.primaryColor,
  )

  if (!isEditMode || !currentColor) {
    return dashboard.primaryColor
  }

  return currentColor
}
