import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useTemplate} from 'Event/TemplateProvider'
import React, {useEffect} from 'react'

/**
 * Run any custom scripts the user (host) has added to the event.
 */
export default function CustomScripts(props: {children: React.ReactElement}) {
  const template = useTemplate()
  const isEditMode = useEditMode()

  const script = template.header.script

  useEffect(() => {
    if (isEditMode || !script) {
      return
    }

    // eslint-disable-next-line
    eval(script)
  })

  return props.children
}
