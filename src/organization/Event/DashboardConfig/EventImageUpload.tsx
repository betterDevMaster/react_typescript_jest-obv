import React, {useCallback, useEffect, useMemo, useState} from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {ObvioEvent} from 'Event'
import {FileLocation} from 'lib/http-client'
import Label from 'lib/ui/form/ImageUpload/Label'
import ImageUpload from 'lib/ui/form/ImageUpload'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Image from 'lib/ui/form/ImageUpload/Image'
import {FileSelect, useFileSelect} from 'lib/ui/form/file'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import Cropper, {CropperProps} from 'lib/ui/form/ImageUpload/Cropper'
import {useTemplate} from 'Event/TemplateProvider'

interface EventImageUploadProps {
  label: string
  property: keyof ObvioEvent
  current?: FileLocation | null
  width?: CropperProps['width']
  height?: CropperProps['height']
  canResize?: CropperProps['canResize']
}

export default function EventImageUpload(props: EventImageUploadProps) {
  const {property, current, width, height, canResize, label} = props

  const image = useFileSelect(current)
  const {selected, wasRemoved} = image
  const upload = useUpload()
  const {set: setEvent} = useEvent()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const template = useTemplate()

  const clearError = () => setError(null)

  const data = useMemo(() => {
    if (selected) {
      const formData = new FormData()
      formData.set(property, selected)
      return formData
    }

    if (wasRemoved) {
      return {
        [property]: null,
      }
    }

    return null
  }, [property, selected, wasRemoved])

  useEffect(() => {
    if (!data) {
      return
    }

    setIsUploading(true)

    clearError()

    upload(data)
      .then((updated) => {
        /**
         * Avoid over-writing the template which would throw away
         * any unsaved changes if we're mid-configuring a form
         * that had an image upload.
         */
        setEvent({
          ...updated,
          template,
        })
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }, [selected, wasRemoved, upload, data, setEvent, template])

  const hasCropSettings =
    width !== undefined || height !== undefined || canResize !== undefined

  const imageComponentProps = {
    image,
    isUploading,
    property,
    label,
    error,
  }

  if (hasCropSettings) {
    return (
      <ImageComponents {...imageComponentProps}>
        <Cropper width={width} height={height} canResize={canResize} />
      </ImageComponents>
    )
  }

  return <ImageComponents {...imageComponentProps} />
}

function ImageComponents(props: {
  children?: React.ReactElement
  image: FileSelect
  isUploading: boolean
  property: EventImageUploadProps['property']
  label: EventImageUploadProps['label']
  error: string | null
}) {
  const {image, isUploading, property, label, error} = props
  const inputLabel = `${property} image input`

  return (
    <Box>
      <ImageUpload file={image} disabled={isUploading}>
        {props.children || null}
        <Label>{label}</Label>
        <Image alt={`current ${property}`} width={200} />
        <UploadButton
          inputProps={{
            'aria-label': inputLabel,
          }}
        />
        <RemoveImageButton aria-label={`remove ${property} image`} />
      </ImageUpload>
      <Error>{error}</Error>
    </Box>
  )
}

function useUpload() {
  const {event} = useEvent()
  const {client} = useOrganization()

  const url = api(`/events/${event.slug}`)

  return useCallback(
    (data: {} | FormData) => {
      return client.put<ObvioEvent>(url, data)
    },
    [client, url],
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

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`
