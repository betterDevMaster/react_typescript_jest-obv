import TextField from '@material-ui/core/TextField'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import React from 'react'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useForm} from 'react-hook-form'

export function ResourceListConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const {template, update} = useSimpleBlog()
  const {resourceList: list} = template
  const {handleSubmit, register} = useForm()

  const save = (data: any) => {
    update.primitive('resourceList')({
      resources: [list.resources],
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
        <SaveButton type="submit" />
      </form>
    </ComponentConfig>
  )
}
