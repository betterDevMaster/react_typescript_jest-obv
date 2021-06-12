import Button from '@material-ui/core/Button'
import React from 'react'
import {usePanels} from 'Event/template/Panels'
import {Resource} from './ResourceItem'

export default function AddResourceButton(props: {
  className?: string
  groupId: number
  edit: (index: number) => void
}) {
  const {template, update} = usePanels()
  const groups = template.resourceGroupList
  const updateTemplate = update.primitive('resourceGroupList')
  const group = groups.resourceGroups[props.groupId]

  const addResource = () => {
    const resources: Resource[] = [
      ...group.resources,
      {
        name: 'Resource',
        filePath: '',
      },
    ]
    const updatedGroup = {
      ...group,
      resources,
    }
    const updatedGroups = groups.resourceGroups.map((tr, index) => {
      if (index === props.groupId) {
        return updatedGroup
      }
      return tr
    })
    updateTemplate({
      resourceGroups: updatedGroups,
    })

    const lastItem = resources.length - 1
    props.edit(lastItem)
  }

  return (
    <Button
      size="medium"
      variant="contained"
      color="primary"
      aria-label="add grouped resource"
      onClick={addResource}
      className={props.className}
    >
      Add Resource
    </Button>
  )
}
