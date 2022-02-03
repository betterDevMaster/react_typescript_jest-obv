import React, {useState} from 'react'
import Image from 'lib/ui/ImageUploader/ImageUpload/Image'
import UploadButton from 'lib/ui/ImageUploader/ImageUpload/UploadButton'
import Cropper from 'lib/ui/ImageUploader/ImageUpload/Cropper'
import {is, hasChildren} from 'lib/react-utils'
import RemoveIconButton from 'lib/ui/ImageUploader/ImageUpload/RemoveIconButton'

export const MAX_FILE_SIZE_BYTES = 5000000 // 5MB

export default function ImageUpload(props) {
  const {file, disabled, children} = props
  const [cropTarget, setCropTarget] = useState(null)

  const components = Array.isArray(children) ? children : [children]

  const hasCropper = hasComponent(Cropper, components)

  const handleSelected = (image) => {
    if (!hasCropper) {
      file.select(image)
      return
    }

    setCropTarget(image)
  }

  const handleCancelledCrop = () => {
    file.select(cropTarget)
    setCropTarget(null)
  }

  const handleCrop = (cropped) => {
    file.select(cropped)
    setCropTarget(null)
  }

  const withProps = (components) => {
    return components.map((component, index) => {
      /**
       * Handle 'null's
       */

      if (!component) {
        return component
      }

      if (is(UploadButton, component)) {
        return (
          <UploadButton
            {...component.props}
            onSelect={handleSelected}
            selected={file.selected}
            isVisible={file.canUpload}
            disabled={disabled}
            key={index}
          />
        )
      }

      if (is(Image, component)) {
        const isVisible = () => {
          if (!props.autoUpload) {
            return !file.wasRemoved
          }

          return Boolean(file.current)
        }

        return (
          <Image
            {...component.props}
            current={file.current}
            selected={file.selected}
            isVisible={isVisible()}
            key={index}
          >
            <RemoveIconButton
              {...component.props}
              onClick={file.remove}
              isVisible={file.canRemove}
              selected={file.selected}
              disabled={disabled}
              key={index}
            />
          </Image>
        )
      }

      if (is(Cropper, component)) {
        return (
          <Cropper
            key={index}
            {...component.props}
            image={cropTarget}
            isOpen={Boolean(cropTarget)}
            onCancel={handleCancelledCrop}
            onCrop={handleCrop}
          />
        )
      }

      /**
       * Component could have children that are target components. If we
       * come across children comps we'll recursively map over those
       * too to add our props.
       */
      if (hasChildren(component)) {
        return React.cloneElement(component, {
          children: withProps(component.props.children),
          key: index,
        })
      }

      /**
       * Regular component, we'll just add the required 'key'
       * for our map.
       */

      return React.cloneElement(component, {key: index})
    })
  }

  return withProps(components)
}

function hasComponent(target, components) {
  return !!components.find((component) => {
    if (!component) {
      return false
    }

    if (is(target, component)) {
      return true
    }

    const hasChildren = typeof component.props.children === 'object'
    if (hasChildren) {
      return hasComponent(component, component.props.children)
    }

    return false
  })
}
