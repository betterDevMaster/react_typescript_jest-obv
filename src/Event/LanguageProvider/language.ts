import {Rule} from 'Event/visibility-rules'

export const ENGLISH = 'English'

export type Language = {
  name: string
  rules: Rule[]
}

export const createLanguage = (
  name: string,
  options?: {
    rules?: Rule[]
  },
): Language => ({
  name,
  rules: options?.rules || [],
})
