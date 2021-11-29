import React, {useState, useCallback} from 'react'
import {api} from 'lib/url'
import CircularProgress from '@material-ui/core/CircularProgress'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import UploadDropzone from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceUpload/UploadDropzone'
import UploadedFile from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceUpload/UploadedFile'

export const ACCEPTED_FILE_TYPES = ['image/*', '.pdf', '.xlsx']
export const MAX_FILE_SIZE_BYTES = 150000000 // bytes
export const MAX_NUM_FILES = 1

interface ResourceUpload {
  file: string
}

export default function ResourceUpload(props: {
  filePath: string
  isUrl?: boolean
  onChange: (filePath: string) => void
}) {
  const {filePath, onChange, isUrl} = props
  const {client} = useOrganization()
  const {event} = useEvent()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const deleteFile = useDeleteFile()

  const hasExistingFile = Boolean(filePath)

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
        onChange(upload.file)
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
      removeFile().then(() => {
        upload(acceptedFile)
      })
      return
    }

    upload(acceptedFile)
  }

  const removeFile = () => {
    setIsUploading(true)

    return deleteFile(filePath)
      .then(() => {
        onChange('')
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  if (isUrl) {
    return null
  }

  return (
    <>
      <Container>
        <UploadDropzone onDrop={handleUpload} />
        <LoadingOverlay visible={isUploading} />
      </Container>
      <UploadedFile filePath={filePath} onRemove={removeFile} />
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
  const {
    event: {slug},
  } = useEvent()
  const {client} = useOrganization()

  return useCallback(
    (file: string) => {
      const url = api(`/events/${slug}/resources/${file}`)
      return client.delete(url)
    },
    [slug, client],
  )
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
