import {useToggle} from 'lib/toggle'
import {useUpdate} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'

export function useSaveTemplate() {
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const template = useTemplate()
  const update = useUpdate()

  const save = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    update({
      template,
    }).finally(toggleProcessing)
  }

  return {save, processing}
}
