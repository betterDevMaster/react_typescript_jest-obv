import {updateTemplate} from 'Event/state/actions'
import {Template} from 'Event/template'
import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'

const TemplateContext = React.createContext<Template | undefined>(undefined)

export default function TemplateProvider(props: {
  children: React.ReactNode
  template: Template
}) {
  return (
    <TemplateContext.Provider value={props.template}>
      {props.children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  const context = React.useContext(TemplateContext)
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider')
  }

  return context
}

export function useUpdateTemplate() {
  const dispatch = useDispatch()

  return (updates: Partial<Template>) => {
    dispatch(updateTemplate(updates))
  }
}

export function useUpdateProp() {
  const updateTemplate = useUpdateTemplate()

  return useCallback(
    <K extends keyof Template>(key: K, value: Template[K]) => {
      updateTemplate({
        [key]: value,
      })
    },
    [updateTemplate],
  )
}
