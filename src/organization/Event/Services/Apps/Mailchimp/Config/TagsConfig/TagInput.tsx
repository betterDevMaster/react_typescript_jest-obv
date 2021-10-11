import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import useDebounce from 'lib/debounce'
import {onChangeStringHandler} from 'lib/dom'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {
  ATTENDEE_CHECKED_IN,
  ATTENDEE_SIGNED_WAIVER,
  Tag,
} from 'organization/Event/Services/Apps/Mailchimp'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState, useCallback} from 'react'

/**
 * How many MS to wait after typing to search to see
 * if the tag exists.
 */
export const TAG_SEARCH_DEBOUNCE_MS = 250

export const NEW_TAG_ERROR =
  'Tag does not currently exist. To use it anyway, click SAVE and Obvio will create the tag for you.'

export default function TagInput(props: {
  tag: Tag
  onChange: (tag: Tag) => void
}) {
  const {tag, onChange} = props
  const [name, setName] = useState<string | null>(null)
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const setTag = useSetTag()
  const [reponseError, setResponseError] = useState('')

  const hasChanges = name !== tag.name
  const isNewTag = useIsNewTag({name, hasChanges})

  /**
   * Init load value from current tag
   */
  useEffect(() => {
    setName(tag.name)
  }, [tag])

  const canSave = !processing && hasChanges

  const save = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    const value = name || null
    setTag(tag.id, value)
      .then(onChange)
      .catch((e) => setResponseError(e.message))
      .finally(toggleProcessing)
  }

  const errorMessage = () => {
    if (reponseError) {
      return reponseError
    }

    if (!name) {
      // If tag is blank, then there's no error to show.
      return
    }

    /**
     * If there are no changes, and the tag doesn't exist we
     * assume the user has already clicked save, and so
     * we don't need to show the error.
     */
    if (hasChanges && isNewTag) {
      return NEW_TAG_ERROR
    }
  }

  return (
    <TextField
      value={name || ''}
      onChange={onChangeStringHandler(setName)}
      variant="outlined"
      label={typeLabel(tag)}
      fullWidth
      inputProps={{
        'aria-label': 'tag name',
        maxLength: 100, // mailchimp limit
      }}
      disabled={processing}
      error={Boolean(errorMessage())}
      helperText={errorMessage()}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={save}
              disabled={!canSave}
              color="primary"
              aria-label="set tag name"
            >
              Save
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )
}

function typeLabel(tag: Tag) {
  const labels: Record<string, string> = {
    [ATTENDEE_SIGNED_WAIVER]: 'Attendee Signed Waiver',
    [ATTENDEE_CHECKED_IN]: 'Attendee Checked In',
  }

  const label = labels[tag.type]
  if (!label) {
    throw new Error(`Label not defined for tag type: ${tag.type}`)
  }

  return label
}

function useSetTag() {
  const {client} = useOrganization()
  const {event} = useEvent()

  return (id: number, name: string | null) => {
    const url = api(`/events/${event.slug}/integrations/mailchimp/tags/${id}`)
    return client.patch<Tag>(url, {
      name,
    })
  }
}

function useFindTag() {
  const {client} = useOrganization()
  const {
    event: {slug},
  } = useEvent()

  return useCallback(
    (name: string) => {
      const url = api(`/events/${slug}/integrations/mailchimp/tags/${name}`)
      return client.get<Tag>(url)
    },
    [client, slug],
  )
}

export function useIsNewTag({
  name,
  hasChanges,
}: {
  name: string | null
  hasChanges: boolean
}) {
  /**
   * Debounce value changes so we're not constantly checking on every
   * character typed.
   */
  const debouncedName = useDebounce(name, TAG_SEARCH_DEBOUNCE_MS)

  const findTag = useFindTag()
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    if (!hasChanges) {
      return
    }

    if (!debouncedName) {
      return
    }

    findTag(debouncedName)
      .then(() => {
        setIsNew(false)
      })
      .catch(() => {
        /**
         * If a tag doesn't exist it'll return a 404, so we'll just assume it's new here.
         * Technically on server error we can't validate if it's new, but it's safe to
         * assume if we can't validate, it MIGHT be new.
         */
        setIsNew(true)
      })
  }, [findTag, debouncedName, hasChanges])

  return isNew
}
