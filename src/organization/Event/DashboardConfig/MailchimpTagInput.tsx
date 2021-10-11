import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {MailchimpTag} from 'Event/mailchimp'
import {onChangeStringHandler} from 'lib/dom'
import {
  NEW_TAG_ERROR,
  useIsNewTag,
} from 'organization/Event/Services/Apps/Mailchimp/Config/TagsConfig/TagInput'
import React from 'react'

export default function MailchimpTagInput(props: {
  onChange: (tag: MailchimpTag | null) => void
  value?: MailchimpTag | null
  disabled?: boolean
}) {
  const {disabled, value} = props
  const {event} = useEvent()

  const name = value || ''

  /**
   * Having hasChanges to true means we'll always check that the tag
   * exists even on load.
   */
  const isNewTag = useIsNewTag({name, hasChanges: true})

  const error = isNewTag ? NEW_TAG_ERROR : ''

  if (!event.has_mailchimp) {
    return null
  }

  return (
    <TextField
      value={name}
      label="Mailchimp Tag"
      fullWidth
      inputProps={{
        'aria-label': 'mailchimp tag',
      }}
      onChange={onChangeStringHandler(props.onChange)}
      disabled={disabled}
      error={Boolean(error)}
      helperText={error}
    />
  )
}
