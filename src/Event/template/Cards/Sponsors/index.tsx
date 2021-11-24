import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/Cards/Sponsors/SponsorList'
import SponsorEditDialog from 'Event/template/Cards/Sponsors/SponsorEditDialog'
import {useAttendeeVariables} from 'Event'
import {PageTitle, PageDescription} from 'Event/template/Cards/Page'
import {useCardsTemplate} from 'Event/template/Cards'
import Content from 'lib/ui/form/TextEditor/Content'
import CardsPage from 'Event/template/Cards/Page'
import {User} from 'auth/user'

export default function CardsSponsorPage(props: {
  isEditMode?: boolean
  sponsors: Sponsor[]
  user: User
}) {
  const {sponsors: sponsorsPageSettings} = useCardsTemplate()
  const {sponsors} = props
  const v = useAttendeeVariables()

  const content = (
    <>
      <PageTitle aria-label="sponsors title">
        {v(sponsorsPageSettings.title)}
      </PageTitle>
      <PageDescription aria-label="sponsors description">
        <Content>{v(sponsorsPageSettings.description)}</Content>
      </PageDescription>
      <SponsorEditDialog isEditMode={props.isEditMode} />
      <SponsorList sponsors={sponsors} isEditMode={props.isEditMode} />
    </>
  )

  if (props.isEditMode) {
    return content
  }

  return <CardsPage user={props.user}>{content}</CardsPage>
}
