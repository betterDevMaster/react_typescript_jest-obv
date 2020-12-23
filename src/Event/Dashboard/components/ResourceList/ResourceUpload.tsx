import React, {ReactElement, useCallback, useState} from 'react'
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
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import {client} from 'lib/api-client'
import {OBVIO_ORG_TOKEN_KEY} from '../../../../obvio/auth'

export const ACCEPTED_FILE_TYPES = ['image/*', '.pdf']
export const MAX_FILE_SIZE = 2000000
export const MAX_UPLOAD_COUNT = 1

interface ResourceUploadProps {
  resourceUpdate: any
  resourceId: number
}

export default function ResourceUpload(props: ResourceUploadProps) {
  const {resourceList: list} = useTemplate()
  // const {client} = useOrganization();
  const {event} = useEvent()
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploadingError, setHasUploadingError] = useState(false)

  const resource = list.resources[props.resourceId]

  const uploadFileRequest = async (acceptedFile: File) => {
    const formData = new FormData()
    formData.set('file', acceptedFile)

    try {
      if (resource.filePath && resource.filePath.length > 0) {
        await props.resourceUpdate('filePath')('')
      }

      const url = api(`/events/${event.slug}/resources`)
      const {file} = await client.post(url, formData, {
        tokenKey: OBVIO_ORG_TOKEN_KEY,
        headers: {
          'content-type': 'multipart/form-data',
        },
      })

      if (file) {
        await props.resourceUpdate('filePath')(file)
      }
    } catch (e) {
      setHasUploadingError(true)
      console.error(e.message)
    }

    setIsUploading(false)
  }

  const removeFile = async (file: string): Promise<void> => {
    setIsUploading(true)
    const url = api(`/events/${event.slug}/resources/${file}`)

    await client.delete(url, {
      tokenKey: OBVIO_ORG_TOKEN_KEY,
    })

    // TODO: Promisify this function
    await props.resourceUpdate('filePath')('')
    setIsUploading(false)
  }

  return (
    <>
      <UploadDropzone
        uploadFileRequest={uploadFileRequest}
        setHasUploadingError={setHasUploadingError}
        setIsUploading={setIsUploading}
      />
      {isUploading && (
        <LoaderWrapper>
          <CircularProgress />
        </LoaderWrapper>
      )}
      <HasUploadedFile filePath={resource.filePath}>
        <>
          <DangerButton onClick={() => removeFile(resource.filePath)}>
            Remove Image
          </DangerButton>
          <ResourceImageWrapper
            bgImg={storage(`/event/resources/${resource.filePath}`)}
          />
        </>
      </HasUploadedFile>
      <HasUploadingError
        hasError={hasUploadingError}
        message="There was something wrong when trying to upload your file. Please try again."
      />
    </>
  )
}

interface UploadDropzoneProps {
  uploadFileRequest: (acceptedFile: File) => void
  setHasUploadingError: (state: boolean) => void
  setIsUploading: (state: boolean) => void
}

export function UploadDropzone(props: UploadDropzoneProps) {
  const onDrop = async (
    acceptedFiles: File[],
    triggerUploadFile: (acceptedFile: File) => void,
  ) => {
    props.setHasUploadingError(false)
    props.setIsUploading(true)
    const acceptedFile = acceptedFiles[0]
    await triggerUploadFile(acceptedFile)
  }

  const {getRootProps, getInputProps} = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, props.uploadFileRequest),
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_UPLOAD_COUNT,
  })
  const {ref, ...rootProps} = getRootProps()

  return (
    <PaperDropzone {...rootProps} aria-label="resource upload">
      <input {...getInputProps()} />
      <p>Drop a file here or click to upload</p>
    </PaperDropzone>
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

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ResourceImageWrapper = styled.div<{bgImg: string}>`
  width: 100%;
  height: 240px;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => (props.bgImg ? props.bgImg : '')});
`

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

interface HasUploadedFileProps {
  filePath: string
  children: ReactElement
}

function HasUploadedFile(props: HasUploadedFileProps) {
  if (!props.filePath) {
    return null
  }

  return props.children
}

interface HasErrorProps {
  message: string
  hasError: boolean
}

function HasUploadingError({message, hasError}: HasErrorProps) {
  if (!hasError) {
    return null
  }

  return <ErrorText color="error">{message}</ErrorText>
}
