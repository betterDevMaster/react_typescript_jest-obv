import Button from '@material-ui/core/Button'
import {
  RESOURCE_ICON,
  RESOURCE_ITEM,
} from 'Event/template/SimpleBlog/Dashboard/ResourceList'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import React from 'react'
import {useDispatch} from 'react-redux'

export default function AddResourceButton(props: {className?: string}) {
  const updateTemplate = useDispatchUpdate()
  const {template} = useSimpleBlog()

  const {resourceList: list} = template
  const dispatch = useDispatch()

  const addResource = () => {
    const resources = [
      ...list.resources,
      {
        name: 'Resource',
        filePath: '',
        icon: RESOURCE_ICON.pdf,
        isVisible: true,
        rules: [],
      },
    ]
    updateTemplate({
      resourceList: {
        ...list,
        resources,
      },
    })

    const lastItem = resources.length - 1
    dispatch(setConfig({type: RESOURCE_ITEM, id: lastItem}))
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
