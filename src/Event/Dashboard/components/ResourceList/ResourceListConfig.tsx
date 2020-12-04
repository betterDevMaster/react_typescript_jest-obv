import TextField from '@material-ui/core/TextField'
import {
  ResourceList,
  RESOURCE_LIST,
} from 'Event/Dashboard/components/ResourceList'
import {
  useDashboard,
  useUpdateDashboard,
} from 'Event/Dashboard/state/DashboardProvider'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export type ResourceListConfig = {
  type: typeof RESOURCE_LIST
}

export function ResourceListConfig() {
  const {resourceList: list} = useDashboard()
  const updateDashboard = useUpdateDashboard()

  const update = <T extends keyof ResourceList>(key: T) => (
    value: ResourceList[T],
  ) => {
    updateDashboard({
      resourceList: {
        ...list,
        [key]: value,
      },
    })
  }

  return (
    <>
      <TextField
        value={list.description}
        inputProps={{
          'aria-label': 'update resources description',
        }}
        label="Description"
        fullWidth
        onChange={onChangeStringHandler(update('description'))}
      />
    </>
  )
}
