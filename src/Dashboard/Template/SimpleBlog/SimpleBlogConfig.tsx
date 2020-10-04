import {setDashboard} from 'Dashboard/edit/state/actions'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export default function SimpleBlogConfig() {
  const dispatch = useDispatch()
  const dashboard = useSelector((state: RootState) => state.dashboardEditor)

  const update = <T extends keyof SimpleBlog>(key: T) => (
    value: SimpleBlog[T],
  ) => {
    dispatch(
      setDashboard({
        [key]: value,
      }),
    )
  }

  return (
    <>
      <ColorPicker
        label="Primary Color"
        color={dashboard.primaryColor}
        onPick={update('primaryColor')}
      />
    </>
  )
}
