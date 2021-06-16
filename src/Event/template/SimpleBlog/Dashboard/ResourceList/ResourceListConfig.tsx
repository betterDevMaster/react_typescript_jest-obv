import TextField from '@material-ui/core/TextField'
import {RESOURCE_LIST} from 'Event/template/SimpleBlog/Dashboard/ResourceList'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export type ResourceListConfig = {
  type: typeof RESOURCE_LIST
}

export function ResourceListConfig() {
  const {template, update} = useSimpleBlog()
  const {resourceList: list} = template
  const updateResourceList = update.object('resourceList')

  return (
    <>
      <TextField
        value={list.title}
        inputProps={{
          'aria-label': 'update resources title',
        }}
        label="Title"
        fullWidth
        onChange={onChangeStringHandler(updateResourceList('title'))}
      />

      <TextField
        value={list.description}
        inputProps={{
          'aria-label': 'update resources description',
        }}
        label="Description"
        fullWidth
        onChange={onChangeStringHandler(updateResourceList('description'))}
      />
    </>
  )
}
