import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {Tag} from 'organization/Event/Services/Infusionsoft'
import TagIdInput from 'organization/Event/Services/Infusionsoft/Config/TagIdInput'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback, useEffect, useState} from 'react'

export default function Config() {
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
          <h4>Infusionsoft</h4>
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
