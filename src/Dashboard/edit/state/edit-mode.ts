import {ComponentType} from 'Dashboard/components'
import {Component, setComponent} from 'Dashboard/edit/state/actions'
import {useCallback} from 'react'
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

export function useEditComponent({
  type,
  id,
}: {
  type: ComponentType
  id?: Component['id']
}) {
  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(
      setComponent({
        type,
        id,
      }),
    )
  }, [dispatch, type, id])
}
