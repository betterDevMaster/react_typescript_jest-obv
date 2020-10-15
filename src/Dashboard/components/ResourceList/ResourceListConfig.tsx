import TextField from '@material-ui/core/TextField'
import {ResourceList} from 'Dashboard/components/ResourceList'
import {setDashboard} from 'Dashboard/edit/state/actions'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export default function ResourceListConfig() {
  const list = useSelector(
    (state: RootState) => state.dashboardEditor.resourceList,
  )

  const dispatch = useDispatch()

  if (!list) {
    throw new Error('Missing resource list; was it set via edit?')
  }

  const update = <T extends keyof ResourceList>(key: T) => (
    value: ResourceList[T],
  ) => {
    dispatch(
      setDashboard({
        resourceList: {
          ...list,
          [key]: value,
        },
      }),
    )
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
