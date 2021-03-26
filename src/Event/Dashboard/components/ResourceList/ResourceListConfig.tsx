import TextField from '@material-ui/core/TextField'
import {RESOURCE_LIST} from 'Event/Dashboard/components/ResourceList'
import {useTemplate, useUpdateObject} from 'Event/TemplateProvider'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export type ResourceListConfig = {
  type: typeof RESOURCE_LIST
}

export function ResourceListConfig() {
  const {resourceList: list} = useTemplate()
  const updateResourceList = useUpdateObject('resourceList')

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
