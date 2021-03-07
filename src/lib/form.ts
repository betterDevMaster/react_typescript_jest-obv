import {ValidationError} from 'lib/api-client'
import {DeepMap, FieldError} from 'react-hook-form'
import {get} from 'lodash'

export type ReactHookFormErrors = DeepMap<Record<string, any>, FieldError>

/**
 * Helper that takes form errors from react-hook-form, and response errors
 * from the server, and returns a relevant error message for a given
 * field.
 *
 * @param errors
 * @param key
 */
export const fieldError = <T>(
  key: string & keyof T,
  errors: {
    form: ReactHookFormErrors
    response: ValidationError<T>
  },
): string | undefined => {
  /**
   * 'key' could be a property path string such as
   * answers[0].value so we'll use _.get to
   * retrieve the error.
   */
  const formError = get(errors.form, key)
  if (formError) {
    return formError.message
  }

  if (errors.response && errors.response.errors) {
    /**
     * If 'key' contained an array index path such as
     * answers[0].value, the server response will
     * return in dot notation: answers.0.value.
     */
    const objKey = key.replace(/\[/g, '.').replace(']', '') as keyof T

    return (errors.response.errors[objKey] as unknown) as string
  }
}
