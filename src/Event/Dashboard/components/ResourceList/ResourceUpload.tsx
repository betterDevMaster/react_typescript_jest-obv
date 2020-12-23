import React, {useState} from 'react'
import {api, storage} from 'lib/url'
import {useDropzone} from 'react-dropzone'
import CircularProgress from '@material-ui/core/CircularProgress'
import DangerButton from 'lib/ui/Button/DangerButton'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {Resource} from 'Event/Dashboard/components/ResourceList'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import Button from '@material-ui/core/Button'

export const ACCEPTED_FILE_TYPES = ['image/*', '.pdf']
export const MAX_FILE_SIZE_MB = 2000000
export const MAX_NUM_FILES = 1

interface ResourceUploadProps {
  resource: Resource
  update: <T extends keyof Resource>(key: T) => (value: Resource[T]) => void
}

export default function ResourceUpload(props: ResourceUploadProps) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const deleteFile = useDeleteFile()

  const hasExistingFile = props.resource.filePath

  const clearError = () => setError(null)

  interface ResourceUpload {
    file: string
  }

  const upload = (file: File) => {
    clearError()
    const formData = new FormData()
    formData.set('file', file)
    const url = api(`/events/${event.slug}/resources`)

    client
      .post<ResourceUpload>(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((upload) => {
        props.update('filePath')(upload.file)
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  const handleUpload = async (acceptedFile: File) => {
    if (hasExistingFile) {
      removeFile(props.resource).then(() => {
        upload(acceptedFile)
      })
      return
    }

    upload(acceptedFile)
  }

  const removeFile = async (resource: Resource): Promise<void> => {
    setIsUploading(true)
    return deleteFile(resource.filePath)
      .then(() => {
        props.update('filePath')('')
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  return (
    <>
      <UploadDropzone onDrop={handleUpload} />
      <LoadingOverlay visible={isUploading} />
      <ExistingFile resource={props.resource} onRemoveFile={removeFile} />
      <Error>{error}</Error>
    </>
  )
}

interface UploadDropzoneProps {
  onDrop: (acceptedFile: File) => void
}

export function UploadDropzone(props: UploadDropzoneProps) {
  const handleDrop = (files: File[]) => {
    props.onDrop(files[0]) // Should only receive one file
  }

  const {getRootProps, getInputProps} = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE_MB,
    maxFiles: MAX_NUM_FILES,
  })
  const {ref, ...rootProps} = getRootProps()

  return (
    <PaperDropzone {...rootProps} aria-label="resource upload">
      <input {...getInputProps()} />
      <p>Drop a file here or click to upload</p>
    </PaperDropzone>
  )
}

function ExistingFile(props: {
  resource: Resource
  onRemoveFile: (resource: Resource) => void
}) {
  if (!props.resource.filePath) {
    return null
  }

  const remove = () => props.onRemoveFile(props.resource)
  const path = storage(`/event/resources/${props.resource.filePath}`)

  return (
    <>
      <AbsoluteLink to={path} disableStyles newTab>
        <Button variant="outlined" color="primary">
          View Uploaded File
        </Button>
      </AbsoluteLink>
      <DangerButton onClick={remove} variant="outlined">
        Remove File
      </DangerButton>
    </>
  )
}

function LoadingOverlay(props: {visible: boolean}) {
  if (!props.visible) {
    return null
  }

  return (
    <LoaderWrapper>
      <CircularProgress />
    </LoaderWrapper>
  )
}

function useDeleteFile() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (file: string) => {
    const url = api(`/events/${event.slug}/resources/${file}`)
    return client.delete(url)
  }
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return (
    <ErrorText color="error">
      We could not upload your file: {props.children}
    </ErrorText>
  )
}

const PaperDropzone = styled(Paper)`
  cursor: pointer;
  margin-bottom: ${(props) => props.theme.spacing[6]};
  padding: ${(props) => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: center;

  > p {
    margin: 0;
  }
`

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
