import {brandIcons, brandIconPrefixes} from 'lib/fontawesome/icons/brand'
import {normalIcons, normalIconPrefixes} from 'lib/fontawesome/icons/normal'
import {flatMap} from 'lodash'

const prefix = (prefixes: string[], icons: string[]) =>
  flatMap(prefixes, (prefix) => icons.map((icon) => `${prefix} fa-${icon}`))

export const icons = [
  ...prefix(brandIconPrefixes, brandIcons),
  ...prefix(normalIconPrefixes, normalIcons),
]
