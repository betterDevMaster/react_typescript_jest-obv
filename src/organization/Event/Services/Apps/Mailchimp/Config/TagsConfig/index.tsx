import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Tag} from 'organization/Event/Services/Apps/Mailchimp'
import TagInput from 'organization/Event/Services/Apps/Mailchimp/Config/TagsConfig/TagInput'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'

export default function TagsConfig() {
  const {tags, update} = useTags()

  return (
    <Box mb={2}>
      <Box mb={3}>
        <InputLabel>Action Tags</InputLabel>
      </Box>
      {tags.map((tag) => (
        <TagInput tag={tag} key={tag.id} onChange={update} />
      ))}
    </Box>
  )
}

function useTags() {
  const [tags, setTags] = useState<Tag[]>([])

  const {data, loading} = useSavedTags()

  useEffect(() => {
    if (!data) {
      return
    }

    setTags(data)
  }, [data])

  const update = (tag: Tag) => {
    setTags((current) =>
      current.map((t) => {
        const isTarget = t.type === tag.type
        if (isTarget) {
          return tag
        }

        return t
      }),
    )
  }

  return {tags, loading, update}
}

function useSavedTags() {
  const {client} = useOrganization()
  const {event} = useEvent()

  const request = useCallback(() => {
    return client.get<Tag[]>(
      api(`/events/${event.slug}/integrations/mailchimp/tags`),
    )
  }, [client, event])

  return useAsync(request)
}
