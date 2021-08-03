import {updateTemplate} from 'Event/state/actions'
import {Template} from 'Event/template'
import {PANELS, DEFAULTS as PANELS_DEFAULTS} from 'Event/template/Panels'
import {
  DEFAULTS as SIMPLE_BLOG_DEFAULTS,
  SIMPLE_BLOG,
} from 'Event/template/SimpleBlog'
import {withDefaults} from 'lib/object'
import {DeepRequired} from 'lib/type-utils'
import React, {useCallback, useMemo} from 'react'
import {useDispatch} from 'react-redux'

const TemplateContext = React.createContext<DeepRequired<Template> | undefined>(
  undefined,
)

export default function TemplateProvider(props: {
  children: React.ReactNode
  template: Template
}) {
  const {template} = props

  /**
   * Fill out the template with any missing defaults
   */
  const filled = useMemo(() => {
    const defaults = defaultsFor(template)
    return withDefaults(defaults, template)
  }, [template])

  return (
    <TemplateContext.Provider value={filled}>
      {props.children}
    </TemplateContext.Provider>
  )
}

function defaultsFor(template: Template): DeepRequired<Template> {
  switch (template.name) {
    case SIMPLE_BLOG:
      return SIMPLE_BLOG_DEFAULTS
    case PANELS:
      return PANELS_DEFAULTS
  }
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
