import React, {useEffect, useState} from 'react'
import Image from 'lib/ui/form/ImageUpload/Image'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import RemoveButton from 'lib/ui/form/ImageUpload/RemoveButton'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'

export const MAX_FILE_SIZE_BYTES = 5000000 // 5MB

export default function ImageUpload(props) {
  const {file, disabled} = props
  const [cropDialogVisible, setCropDialogVisible] = useState(false)

  const {selected} = file

  const toggleCropDialog = () => setCropDialogVisible(!cropDialogVisible)

  useEffect(() => {
    if (!selected) {
      return
    }

    setCropDialogVisible(true)
  }, [selected])

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

      if (is(Cropper, component)) {
        return (
          <Cropper
            key={index}
            {...component.props}
            image={file.selected}
            isOpen={cropDialogVisible}
            onClose={toggleCropDialog}
            onDone={file.select}
          />
        )
      }

      /**
       * Component could have children that are target components. If we
       * come across children comps we'll recursively map over those
       * too to add our props.
       */

      const hasChildren = typeof component.props.children === 'object'
      if (hasChildren) {
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

  return withProps(props.children)
}

function is(fn, component) {
  const componentName = component.type ? component.type.name : null
  return fn.name === componentName
}
