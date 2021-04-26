import styled from 'styled-components'
import React, {useRef, useState} from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {v4 as uuid} from 'uuid'
import DangerButton from 'lib/ui/Button/DangerButton'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import InputLabel from '@material-ui/core/InputLabel'

const MAX_FILE_SIZE_BYTES = 5000000 // 5MB

export default function ImageUpload(props) {
  const {file, disabled} = props

  const withProps = (children) => {
    const components = Array.isArray(children) ? children : [children]

    return components.map((component, index) => {
      if (is(UploadButton, component)) {
        return (
          <UploadButton
            {...component.props}
            onSelect={file.select}
            selected={file.selected}
            isVisible={file.canUpload}
            disabled={disabled}
            key={index}
          />
        )
      }

      if (is(Image, component)) {
        return (
          <Image
            {...component.props}
            current={file.current}
            selected={file.selected}
            isVisible={!file.wasRemoved}
            key={index}
          />
        )
      }

      if (is(RemoveButton, component)) {
        return (
          <RemoveButton
            {...component.props}
            onClick={file.remove}
            isVisible={file.canRemove}
            selected={file.selected}
            disabled={disabled}
            key={index}
          />
        )
      }

      const hasChildren = typeof component.props.children === 'object'
      if (hasChildren) {
        return React.cloneElement(component, {
          children: withProps(component.props.children),
          key: index,
        })
      }

      return React.cloneElement(component, {key: index})
    })
  }

  return withProps(props.children)
}

export function Image(props) {
  const {selected, current, alt} = props

  if (!props.isVisible) {
    return null
  }

  if (Boolean(selected)) {
    const src = URL.createObjectURL(selected)
    return <ImageEl src={src} alt={alt} />
  }

  if (!current) {
    return null
  }

  return <ImageEl src={current.url} alt={current.name} />
}

export function UploadButton(props) {
  const [error, setError] = useState(null)

  const id = useRef(uuid())

  const handleFileSelect = (e) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image too large. Please select an image smaller than 5MB.')
      return
    }

    if (!file) {
      return
    }

    props.onSelect(file)
  }

  if (!props.isVisible) {
    return null
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        aria-label="select image to upload"
        disabled={props.disabled}
      >
        <UploadButtonLabel htmlFor={id.current}>Upload</UploadButtonLabel>
      </Button>
      <input
        id={id.current}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        value="" // Required to allow uploading multiple times / re-selecting
        hidden
        aria-label={props.inputProps?.['aria-label']}
      />
      <Error>{error}</Error>
    </>
  )
}

export function RemoveButton(props) {
  if (!props.isVisible) {
    return null
  }

  return (
    <DangerButton
      variant="outlined"
      aria-label={props['aria-label']}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      Remove
    </DangerButton>
  )
}

export function Error(props) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}

function is(fn, component) {
  const componentName = component.type ? component.type.name : null
  return fn.name === componentName
}

const UploadButtonLabel = styled.label`
  cursor: pointer;
`

const ImageEl = styled.img`
  width: 100%;
  max-height: 100%;
`

export const Label = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)
