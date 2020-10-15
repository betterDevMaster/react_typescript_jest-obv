import Button from '@material-ui/core/Button'
import {RESOURCE_ICON} from 'Dashboard/components/ResourceList'
import {setDashboard} from 'Dashboard/edit/state/actions'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export default function AddResourceButton(props: {className?: string}) {
  const dispatch = useDispatch()
  const list = useSelector(
    (state: RootState) => state.dashboardEditor.resourceList,
  )

  if (!list) {
    throw new Error('Resource list missing; was it set via edit?')
  }

  const addResource = () => {
    dispatch(
      setDashboard({
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
      }),
    )
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
