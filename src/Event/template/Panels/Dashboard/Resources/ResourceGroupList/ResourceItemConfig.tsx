import TextField from '@material-ui/core/TextField'

import {onChangeStringHandler} from 'lib/dom'
import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCallback} from 'react'
import ResourceUpload, {
  useDeleteFile,
} from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceUpload'
import {Resource} from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceItem'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import FormControl from '@material-ui/core/FormControl'
import {usePanels} from 'Event/template/Panels'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function ResourceItemConfig(props: {
  onClose: () => void
  itemId: number | null
  groupId: number | null
}) {
  if (props.groupId === null || props.itemId === null) {
    return null
  }

  return (
    <Conent onClose={props.onClose} id={props.itemId} groupId={props.groupId} />
  )
}

function Conent(props: {onClose: () => void; id: number; groupId: number}) {
  const {template, update: updateResourceGroup} = usePanels()
  const groups = template.resourceGroupList

  const updateTemplate = updateResourceGroup.primitive('resourceGroupList')
  const deleteFile = useDeleteFile()

  const list = groups?.resourceGroups

  const setUrl = (url: string) => {
    update('url')(url)
  }

  const resource = list[props.groupId].resources[props.id]

  const update = useCallback(
    <T extends keyof Resource>(key: T) =>
      (value: Resource[T]) => {
        const updatedResource: Resource = {
          ...resource,
          [key]: value,
        }

        const updatedList = list[props.groupId].resources.map((tr, index) => {
          if (index === props.id) {
            return updatedResource
          }
          return tr
        })

        const updatedGroup = list.map((tr, index) => {
          if (index === props.groupId) {
            const updated = {
              ...tr,
              resources: updatedList,
            }
            return updated
          }
          return tr
        })

        updateTemplate({
          resourceGroups: updatedGroup,
        })
      },
    [list, props.groupId, props.id, resource, updateTemplate],
  )

  const remove = () => {
    if (resource.filePath) {
      deleteFile(resource.filePath).catch((e) => {
        console.error(e)
      })
    }

    const updatedList = list[props.groupId].resources.filter(
      (tr, index) => index !== props.id,
    )

    const updatedGroups = list.map((tr, index) => {
      if (index === props.groupId) {
        const updated = {
          ...tr,
          resources: updatedList,
        }
        return updated
      }
      return tr
    })

    props.onClose()
    updateTemplate({
      resourceGroups: updatedGroups,
    })
  }

  return (
    <>
      <Dialog onClose={props.onClose} open={true}>
        <DialogTitle>Resource Item</DialogTitle>
        <DialogContent>
          <TextField
            value={resource.name}
            inputProps={{
              'aria-label': 'grouped resource name',
            }}
            label="Name"
            fullWidth
            onChange={onChangeStringHandler(update('name'))}
          />
          <FormControl>
            <ToggleButtonGroup
              value={resource.isUrl ? 'true' : 'false'}
              exclusive
            >
              <ToggleButton
                value="false"
                onClick={() => update('isUrl')(false)}
              >
                File
              </ToggleButton>
              <ToggleButton
                value="true"
                aria-label="set url grouped resource"
                onClick={() => update('isUrl')(true)}
              >
                Link
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
          <ResourceUpload resource={resource} update={update} />
          <UrlField resource={resource} onChange={setUrl} />
          <RemoveButton
            fullWidth
            variant="outlined"
            aria-label="remove grouped resource"
            onClick={remove}
          >
            REMOVE RESOURCE
          </RemoveButton>
        </DialogContent>
      </Dialog>
    </>
  )
}

function UrlField(props: {
  resource: Resource
  onChange: (url: string) => void
}) {
  if (!props.resource.isUrl) {
    return null
  }

  return (
    <TextField
      value={props.resource.url}
      inputProps={{
        'aria-label': 'grouped resource external file url',
      }}
      label="URL starting with http:// or https://"
      fullWidth
      onChange={onChangeStringHandler(props.onChange)}
    />
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
