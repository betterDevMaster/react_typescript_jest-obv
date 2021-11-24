import {Template} from 'Event/template'
import {PANELS, DEFAULTS as PANELS_DEFAULTS} from 'Event/template/Panels'
import {CARDS, DEFAULTS as CARDS_DEFAULTS} from 'Event/template/Cards'
import {
  DEFAULTS as SIMPLE_BLOG_DEFAULTS,
  SIMPLE_BLOG,
} from 'Event/template/SimpleBlog'
import {withDefaults} from 'lib/object'
import {DeepRequired} from 'lib/type-utils'
import React, {useMemo} from 'react'

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
    case CARDS:
      return CARDS_DEFAULTS
  }
}

export function useTemplate() {
  const context = React.useContext(TemplateContext)
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider')
  }

  return context
}
