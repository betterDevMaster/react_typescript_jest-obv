import Button from '@material-ui/core/Button'
import {Resource} from 'Event/template/Panels/Dashboard/Resources/ResourceList'
import ResourceItemConfig from 'Event/template/Panels/Dashboard/Resources/ResourceList/ResourceItemConfig'
import React, {useState} from 'react'

export default function AddResourceButton(props: {className?: string}) {
  const [resource, setResource] = useState<Resource | null>(null)

  const addResource = () => {
    const resource: Resource = {
      name: 'Resource',
      filePath: '',
      description: '',
      isVisible: true,
      rules: [],
      isUrl: false,
    }

    setResource(resource)
  }

  return (
    <>
      <NewResourceConfig
        resource={resource}
        onClose={() => setResource(null)}
      />
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
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
}) {
  const {resource, onClose} = props
  if (!resource) {
    return null
  }

  return <ResourceItemConfig onClose={onClose} resource={resource} isVisible />
}
