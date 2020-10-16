import Button from '@material-ui/core/Button'
import {RESOURCE_ICON} from 'Dashboard/components/ResourceList'
import {useUpdateDashboard} from 'Dashboard/edit/state/edit-mode'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

export default function AddResourceButton(props: {className?: string}) {
  const updateDashboard = useUpdateDashboard()

  const list = useSelector(
    (state: RootState) => state.dashboardEditor.resourceList,
  )

  if (!list) {
    throw new Error('Resource list missing; was it set via edit?')
  }

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
