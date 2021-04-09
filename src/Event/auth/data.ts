import {isAttendee, useEventAuth} from 'Event/auth'
import {time, today} from 'lib/date-time'
import {useCallback} from 'react'

/**
 * Dynamically replace text with data from the currently authenticated
 * Attendee. Variables are defined using {{double braces}}.
 *
 * @returns
 */

export function useWithAttendeeData() {
  const {user} = useEventAuth()

  return useCallback(
    (text: string) => {
      const hasText = Boolean(text)

      // If editing event (ie. host) we won't have an attendee user
      if (!hasText || !isAttendee(user)) {
        return text
      }

      /**
       * Known variables that we'll try to replace first. Anything
       * not defined here we'll assume are custom group
       * keys.
       */

      const baseAttributes = {
        'first name': user.first_name,
        'last name': user.last_name,
        email: user.email,
        today: today(),
        time: time(),
      }

      /**
       * Check if a key is a base attribute
       */

      const isBaseAttribute = (key: string) =>
        Object.keys(baseAttributes).includes(key)

      /**
       * Parse custom variables keys within a text
       */

      const customVariables = (text: string) => {
        return variables(text).filter((v) => !isBaseAttribute(v))
      }

      /**
       * The result with replaced variables
       */

      let result = text

      const replace = (key: string, value: string, text: string) => {
        const match = new RegExp(`{{${key}}}`, 'gi')
        return text.replace(match, value)
      }

      /**
       * Replace base attributes
       */

      for (const [key, value] of Object.entries(baseAttributes)) {
        result = replace(key, value, result)
      }

      /**
       * Replace group values
       */

      for (const key of customVariables(result)) {
        const value = user.groups[key]
        if (!value) {
          continue
        }

        result = replace(key, String(value), result)
      }

      return result
    },
    [user],
  )
}

/**
 * Get the custom {{variables}} within a text
 *
 * @param text
 * @returns
 */

function variables(text: string) {
  const matches = text.match(/{{(.*)}}/g)

  if (!matches) {
    return []
  }

  /**
   * Remove matched {{ brackes }}
   */
  return matches.map((key) => key.replace(/{/g, '').replace(/}/g, ''))
}
