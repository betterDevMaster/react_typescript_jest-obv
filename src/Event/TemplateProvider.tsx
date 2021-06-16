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

export function useUpdate<T extends Template>() {
  const updatePrimitive = useUpdatePrimitive<T>()
  const updateObject = useUpdateObject<T>()

  return {
    primitive: <K extends keyof T>(key: K) => updatePrimitive(key),
    object: <K extends keyof T>(key: K) => updateObject(key),
  }
}

function useUpdatePrimitive<T extends Template>() {
  const updateTemplate = useDispatchUpdate()

  return useCallback(
    <K extends keyof T>(key: K) => (value: T[K]) => {
      updateTemplate({
        [key]: value,
      })
    },
    [updateTemplate],
  )
}

function useUpdateObject<T extends Template>() {
  const updateTemplate = useDispatchUpdate()
  const template = useTemplate() as T

  return useCallback(
    <K extends keyof T>(key: K) => <P extends keyof NonNullable<T[K]>>(
      childKey: P,
    ) => (value: NonNullable<T[K]>[P]) => {
      updateTemplate({
        [key]: {
          ...((template[key] || {}) as {}),
          [childKey]: value,
        },
      })
    },
    [template, updateTemplate],
  )
}

export function useDispatchUpdate() {
  const dispatch = useDispatch()

  return useCallback(
    (updates: Partial<Template>) => {
      dispatch(updateTemplate(updates))
    },
    [dispatch],
  )
}
