import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import {Resource, RESOURCE_ITEM} from 'Event/Dashboard/components/ResourceList'
import {onChangeStringHandler} from 'lib/dom'
import React, {useState} from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useTemplate,
  useUpdateDashboard,
} from 'Event/Dashboard/state/TemplateProvider'
import {useDropzone} from 'react-dropzone'
import {useCallback, Fragment} from 'react'
import {client} from 'lib/api-client'
import {useEvent} from 'Event/EventProvider'
import {api, storage} from 'lib/url'
import {OBVIO_ORG_TOKEN_KEY} from 'obvio/auth'

export type ResourceItemConfig = {
  type: typeof RESOURCE_ITEM
  id: number
}

export function ResourceItemConfig(props: {id: ResourceItemConfig['id']}) {
  const {resourceList: list} = useTemplate()
  const {event} = useEvent()

  const updateDashboard = useUpdateDashboard()
  const closeConfig = useCloseConfig()

  if (props.id === undefined || typeof props.id !== 'number') {
    throw new Error('Missing component id')
  }

  const resource = list.resources[props.id]

  const update = <T extends keyof Resource>(key: T) => (value: Resource[T]) => {
    const updated = {
      ...resource,
      [key]: value,
    }

    updateDashboard({
      resourceList: {
        ...list,
        resources: list.resources.map((r, index) => {
          const isTarget = index === props.id
          if (isTarget) {
            return updated
          }

          return r
        }),
      },
    })
  }

  const remove = () => {
    closeConfig()
    updateDashboard({
      resourceList: {
        ...list,
        resources: list.resources.filter((_, index) => index !== props.id),
      },
    })
  }

  const [isUploading, setIsUploading] = useState<boolean>(false)

  const onDrop = useCallback(
    (acceptedFiles) => {
      setIsUploading(true)
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader()

        reader.onload = async () => {
          const formData = new FormData()
          formData.set('file', file)

          try {
            if (resource.filePath && resource.filePath.length > 0) {
              await update('filePath')('')
            }

            const url = api(`/events/${event.slug}/resources`)
            const {file} = await client.post(url, formData, {
              tokenKey: OBVIO_ORG_TOKEN_KEY,
              headers: {
                'content-type': 'multipart/form-data',
              },
            })

            if (file) {
              await update('filePath')(file)
            }
          } catch (e) {
            console.error(e.message)
          }
          setIsUploading(false)
        }
        reader.readAsArrayBuffer(file)
      })
    },
    [event.slug, resource.filePath],
  ) // eslint-disable-line

  const removeImage = async (file: string): Promise<void> => {
    setIsUploading(true)
    const url = api(`/events/${event.slug}/resources/${file}`)

    await client.delete(url, {
      tokenKey: OBVIO_ORG_TOKEN_KEY,
    })

    await update('filePath')('')
    await setIsUploading(false)
  }

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: ['image/*', '.pdf'],
  })
  const {ref, ...rootProps} = getRootProps()

  return (
    <>
      <TextField
        value={resource.name}
        inputProps={{
          'aria-label': 'resource name',
        }}
        label="Name"
        fullWidth
        onChange={onChangeStringHandler(update('name'))}
      />
      <PaperDropzone {...rootProps}>
        <input {...getInputProps()} />
        <p>Drop a file here or click to upload</p>
      </PaperDropzone>
      {isUploading && (
        <LoaderWrapper>
          <CircularProgress />
        </LoaderWrapper>
      )}
      {resource.filePath && (
        <Fragment>
          <DangerButton onClick={removeImage.bind(null, resource.filePath)}>
            Remove Image
          </DangerButton>
          <ResourceImageWrapper
            bgImg={storage(`/event/resources/${resource.filePath}`)}
          />
        </Fragment>
      )}
      <RemoveButton
        fullWidth
        variant="outlined"
        aria-label="remove resource"
        onClick={remove}
      >
        REMOVE RESOURCE
      </RemoveButton>
    </>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`

interface ResourceImageWrapperProps {
  bgImg: string
}

const PaperDropzone = styled(Paper)`
  cursor: pointer;
  margin-bottom: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  > p {
    margin: 0;
  }
`

const ResourceImageWrapper = styled.div<ResourceImageWrapperProps>`
  width: 100%;
  height: 240px;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => (props.bgImg ? props.bgImg : '')});
`

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
