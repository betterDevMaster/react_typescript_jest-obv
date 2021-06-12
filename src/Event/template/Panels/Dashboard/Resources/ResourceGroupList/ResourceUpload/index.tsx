import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {Resource} from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceItem'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import UploadDropzone from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceUpload/UploadDropzone'
import UploadedFile from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceUpload/UploadedFile'
import CircularProgress from '@material-ui/core/CircularProgress'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'

export const ACCEPTED_FILE_TYPES = ['image/*', '.pdf']
export const MAX_FILE_SIZE_BYTES = 150000000 // bytes
export const MAX_NUM_FILES = 1

interface ResourceUpload {
  file: string
}

export default function ResourceUpload(props: {
  resource: Resource
  update: <T extends keyof Resource>(key: T) => (value: Resource[T]) => void
}) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const deleteFile = useDeleteFile()

  const hasExistingFile = props.resource.filePath

  const clearError = () => setError(null)

  const upload = (file: File) => {
    setIsUploading(true)
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

  if (props.resource.isUrl) {
    return null
  }

  return (
    <>
      <Container>
        <UploadDropzone onDrop={handleUpload} />
        <LoadingOverlay visible={isUploading} />
      </Container>
      <UploadedFile resource={props.resource} onRemoveFile={removeFile} />
      <Error>{error}</Error>
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

export function useDeleteFile() {
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

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

const Container = styled.div`
  position: relative;
`

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
`
