import {SIMPLE_BLOG, SimpleBlog} from 'Event/templates/SimpleBlog'
import {Event} from 'Event'

export type Template = typeof SIMPLE_BLOG
export type TemplateProps = {
  event: Event
}
export type TemplateComponent = React.FunctionComponent<TemplateProps>

const templates: Record<Template, TemplateComponent> = {
  [SIMPLE_BLOG]: SimpleBlog,
}

export const componentFor = (template: Template) => {
  const component = templates[template]
  if (!component) {
    throw new Error(`Undefined template: ${template}`)
  }

  return component
}
