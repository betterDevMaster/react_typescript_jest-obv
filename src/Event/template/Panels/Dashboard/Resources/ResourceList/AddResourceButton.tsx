import Button from '@material-ui/core/Button'
import {usePanels} from 'Event/template/Panels'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import React from 'react'

export default function AddResourceButton(props: {
  className?: string
  edit: (index: number) => void
}) {
  const {edit} = props
  const updateTemplate = useDispatchUpdate()
  const {template} = usePanels()
  const {resourceList: list} = template

  const addResource = () => {
    const resources = [
      ...list.resources,
      {
        name: 'Resource',
        filePath: '',
        description: '',
        isVisible: true,
        rules: [],
        icon: '',
      },
    ]
    updateTemplate({
      resourceList: {
        ...list,
        resources,
      },
    })

    const lastItemIndex = resources.length - 1
    edit(lastItemIndex)
  }

  return (
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
  )
}
