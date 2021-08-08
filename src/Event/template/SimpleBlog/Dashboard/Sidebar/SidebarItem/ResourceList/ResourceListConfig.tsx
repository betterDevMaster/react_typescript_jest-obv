import TextField from '@material-ui/core/TextField'
import React from 'react'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useForm} from 'react-hook-form'
import {ResourceListProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'
import {useUpdateSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

export function ResourceListConfig(
  props: ComponentConfigProps & {
    list: ResourceListProps
  },
) {
  const {isVisible, onClose, list} = props
  const {handleSubmit, register} = useForm()

  const updateItem = useUpdateSidebarItem()

  const save = (data: Pick<ResourceListProps, 'title' | 'description'>) => {
    updateItem({
      ...list,
      ...data,
    })
    onClose()
  }

  return (
    <ComponentConfig isVisible={isVisible} onClose={onClose} title="Resources">
      <form onSubmit={handleSubmit(save)}>
        <TextField
          defaultValue={list.title}
          name="title"
          inputProps={{
            'aria-label': 'update resources title',
            ref: register,
          }}
          label="Title"
          fullWidth
        />

        <TextField
          name="description"
          defaultValue={list.description}
          inputProps={{
            'aria-label': 'update resources description',
            ref: register,
          }}
          label="Description"
          fullWidth
        />
        <SaveButton />
      </form>
    </ComponentConfig>
  )
}
