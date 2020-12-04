import {
  useDashboard,
  useUpdateDashboard,
} from 'Event/Dashboard/state/DashboardProvider'
import {SimpleBlog} from 'Event/Dashboard/Template/SimpleBlog'
import {SIDEBAR_CONTAINER} from 'Event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'

export type SidebarContainerConfig = {
  type: typeof SIDEBAR_CONTAINER
}

export function SidebarContainerConfig() {
  const updateDashboard = useUpdateDashboard()
  const {sidebar} = useDashboard()

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
