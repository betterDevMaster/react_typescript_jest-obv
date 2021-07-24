import React, {useState} from 'react'
import Button from '@material-ui/core/Button'

import {ResourceGroup} from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroup'
import {ResourceGroupConfig} from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroupConfig'

export default function AddResourceGroupButton(props: {className?: string}) {
  const [resourceGroup, setResourceGroup] = useState<ResourceGroup | null>(null)

  const addResource = () => {
    const newResourceGroup: ResourceGroup = {
      title: 'Resource Group',
      description: '',
      resources: [],
      rules: [],
      isVisible: true,
    }
    setResourceGroup(newResourceGroup)
  }

  return (
    <>
      <NewResourceConfig
        resourceGroup={resourceGroup}
        onClose={() => setResourceGroup(null)}
      />
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
    </>
  )
}

function NewResourceConfig(props: {
  resourceGroup: ResourceGroup | null
  onClose: () => void
}) {
  const {resourceGroup, onClose} = props
  if (!resourceGroup) {
    return null
  }

  return (
    <ResourceGroupConfig
      isVisible
      onClose={onClose}
      resourceGroup={resourceGroup}
    />
  )
}
