import Button from '@material-ui/core/Button'
import {RESOURCE_ICON} from 'Event/Dashboard/components/ResourceList'
import {
  useDashboard,
  useUpdateDashboard,
} from 'Event/Dashboard/state/DashboardProvider'
import React from 'react'

export default function AddResourceButton(props: {className?: string}) {
  const updateDashboard = useUpdateDashboard()
  const {resourceList: list} = useDashboard()

  const addResource = () => {
    updateDashboard({
      resourceList: {
        ...list,
        resources: [
          ...list.resources,
          {
            name: 'Resource',
            filePath: '',
            icon: RESOURCE_ICON.pdf,
          },
        ],
      },
    })
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add resource"
      onClick={addResource}
      className={props.className}
    >
      Add Resource
    </Button>
  )
}
