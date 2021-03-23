import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {Tag} from 'organization/Event/Services/Apps/Infusionsoft'
import LoginFieldIdInput from 'organization/Event/Services/Apps/Infusionsoft/Config/LoginFieldInput.tsx'
import TagIdInput from 'organization/Event/Services/Apps/Infusionsoft/Config/TagIdInput'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback, useEffect, useState} from 'react'

export default function Step2() {
  const {tags, loading, setTagId} = useTags()

  if (loading) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  return (
    <Layout>
      <Page>
        <div>
          <Box mb={3}>
            <Typography variant="h4">Infusionsoft</Typography>
          </Box>
          <Box mb={3}>
            <Box mb={2}>
              <Typography variant="h5">Attendee Import</Typography>
              <em> {api('/infusionsoft/attendees/import')} (POST)</em>
            </Box>
            <LoginFieldIdInput />
            <pre>
              {`
                {
                  "first_name": string,
                  "last_name": string,
                  "email": string,
                  "access_token": obv.io access token,
                  "tags": "tag1, tag2, tag3",
                  "MyGroup": "VIP",
                  "Another Group": "Any string value here"
                }
            `}
            </pre>
            <em>
              If an attendee with the given email already exists, obv.io will
              update the other attributes.
            </em>
          </Box>
          <Typography variant="h5">Attendee Delete</Typography>
          <em> {api('/infusionsoft/attendees/delete')} (POST)</em>
          <pre>
            {`
              {
                "email": string,
                "access_token": obv.io access token
              }
            `}
          </pre>
          <Box mb={3}>
            <Typography variant="h5">Tags</Typography>
          </Box>
          {tags.map((tag) => (
            <TagIdInput tag={tag} key={tag.id} onChange={setTagId(tag)} />
          ))}
        </div>
      </Page>
    </Layout>
  )
}

function useTags() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/integrations/infusionsoft/tags`)

  const [tags, setTags] = useState<Tag[]>([])

  const request = useCallback(() => {
    return client.get<Tag[]>(url)
  }, [client, url])

  const {data, loading} = useAsync(request)

  useEffect(() => {
    if (!data) {
      return
    }

    setTags(data)
  }, [data])

  const update = (target: Tag) => {
    const updated = tags.map((t) => {
      const isTarget = t.id === target.id

      if (isTarget) {
        return target
      }

      return t
    })

    setTags(updated)
  }

  const setTagId = (tag: Tag) => (infusionsoftId: string) => {
    client
      .patch<Tag>(
        api(`/events/${event.slug}/integrations/infusionsoft/tags/${tag.id}`),
        {
          id: infusionsoftId,
        },
      )
      .then(update)
  }

  return {
    tags,
    loading,
    setTagId,
  }
}
