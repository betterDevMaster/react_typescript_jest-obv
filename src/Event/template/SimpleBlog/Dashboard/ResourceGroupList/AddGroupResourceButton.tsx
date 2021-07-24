import Button from '@material-ui/core/Button'
import React, {useState} from 'react'
import {Resource} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceItem'
import {ResourceGroupItemConfig} from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroupItemConfig'
import {RESOURCE_ICON} from 'Event/template/SimpleBlog/Dashboard/ResourceList'

export default function AddGroupResourceButton(props: {
  className?: string
  groupIndex: number
}) {
  const [resource, setResource] = useState<Resource | null>(null)

  const addResource = () => {
    const resource = {
      name: 'Resource',
      filePath: '',
      icon: RESOURCE_ICON.pdf,
      isVisible: true,
      rules: [],
    }

    setResource(resource)
  }

  return (
    <>
      <NewResourceConfig
        resource={resource}
        onClose={() => setResource(null)}
        groupIndex={props.groupIndex}
      />
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
    </>
  )
}

function NewResourceConfig(props: {
  resource: Resource | null
  onClose: () => void
  groupIndex: number
}) {
  const {resource, onClose} = props
  if (!resource) {
    return null
  }

  return (
    <ResourceGroupItemConfig
      isVisible
      groupIndex={props.groupIndex}
      onClose={onClose}
      resource={resource}
    />
  )
}
