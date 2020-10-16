import {useUpdateDashboard} from 'Dashboard/edit/state/edit-mode'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

export default function SidebarContainerConfig() {
  const updateDashboard = useUpdateDashboard()
  const sidebar = useSelector(
    (state: RootState) => state.dashboardEditor.sidebar,
  )

  if (!sidebar) {
    throw new Error(
      'Missing sidebar to configure; was it set properly via edit button?',
    )
  }

  const update = <T extends keyof SimpleBlog['sidebar']>(key: T) => (
    value: SimpleBlog['sidebar'][T],
  ) =>
    updateDashboard({
      sidebar: {
        ...sidebar,
        [key]: value,
      },
    })

  return (
    <>
      <ColorPicker
        label="Background Color"
        color={sidebar.background}
        onPick={update('background')}
      />
      <ColorPicker
        label="Text Color"
        color={sidebar.textColor}
        onPick={update('textColor')}
      />
    </>
  )
}
