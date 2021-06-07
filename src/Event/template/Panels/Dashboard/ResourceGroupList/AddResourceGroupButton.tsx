import React from 'react'
import Button from '@material-ui/core/Button'

import {ResourceGroup} from 'Event/template/Panels/Dashboard/ResourceGroupList/ResourceGroup'
import {usePanels} from 'Event/template/Panels'

export default function AddResourceGroupButton(props: {
  className?: string
  edit: (index: number) => void
}) {
  const {template, update} = usePanels()
  const groups = template.resourceGroupList

  const updateTemplate = update.primitive('resourceGroupList')
  const list = groups?.resourceGroups || []

  const addResource = () => {
    const newResourceGroup: ResourceGroup = {
      title: 'Resource Group',
      description: '',
      resources: [],
      rules: [],
      isVisible: true,
    }
    const addedList = [...list, newResourceGroup]
    updateTemplate({
      resourceGroups: addedList,
    })

    const lastItem = addedList.length - 1
    props.edit(lastItem)
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add resource group"
      onClick={addResource}
      className={props.className}
    >
      Add Resource Group
    </Button>
  )
}
