import Button from '@material-ui/core/Button'
import {
  ResourceListProps,
  RESOURCE_ICON,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList'
import React, {useState} from 'react'
import {Resource} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceItem'
import {ResourceItemConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceItemConfig'

export default function AddResourceButton(props: {
  className?: string
  list: ResourceListProps
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
        list={props.list}
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
  list: ResourceListProps
}) {
  const {resource, onClose} = props
  if (!resource) {
    return null
  }

  return (
    <ResourceItemConfig
      isVisible
      onClose={onClose}
      resource={resource}
      list={props.list}
    />
  )
}
