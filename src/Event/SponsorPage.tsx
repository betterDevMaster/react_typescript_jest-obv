import React from 'react'

import {useTrackEventPage} from 'analytics'

import {useAttendee} from 'Event/auth'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSponsorPage from 'Event/template/SimpleBlog/SponsorPage'
import {PANELS} from 'Event/template/Panels'
import PanelsSponsorPage from 'Event/template/Panels/Dashboard/Sponsors'
import {CARDS} from 'Event/template/Cards'
import CardsSponsorPage from 'Event/template/Cards/Sponsors'
import {FIFTY_BLOG} from './template/FiftyBlog'
import FiftyBlogSponsorPage from 'Event/template/FiftyBlog/Dashboard/Sponsors'

import {FileLocation} from 'lib/http-client'
import {EntityList} from 'lib/list'

import NavButton from 'Event/Dashboard/components/NavButton'
import {useTemplate} from 'Event/TemplateProvider'
import PagePoints, {SPONSORS} from 'Event/PointsProvider/PagePoints'

import {Form} from 'organization/Event/FormsProvider'
import {useSponsors} from 'organization/Event/SponsorsProvider'
import {EventSponsorsProvider} from 'organization/Event/SponsorsProvider'

export interface Sponsor {
  id: number
  image: FileLocation | null
  name: string
  description: string
  form: Form | null
  settings: null | {
    buttons?: EntityList<NavButton>
  }
}

export default function SponsorPage(props: {isEditMode?: boolean}) {
  return (
    <PagePoints page={SPONSORS}>
      <EventSponsorsProvider>
        <Sponsors />
      </EventSponsorsProvider>
    </PagePoints>
  )
}

function Sponsors() {
  const {name} = useTemplate()

  const user = useAttendee()

  useTrackEventPage({
    page: 'Visited Sponsors',
  })

  const {sponsors, loading} = useSponsors()

  if (loading) {
    return null
  }

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSponsorPage user={user} sponsors={sponsors} />
    case PANELS:
      return <PanelsSponsorPage sponsors={sponsors} />
    case CARDS:
      return <CardsSponsorPage user={user} sponsors={sponsors} />
    case FIFTY_BLOG:
      return <FiftyBlogSponsorPage sponsors={sponsors} />
    default:
      throw new Error(`Missing sponsor page for template: ${name}`)
  }
}
