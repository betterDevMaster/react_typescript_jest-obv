import React from 'react'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/Cards/Speakers/SpeakerList'
import SpeakerEditDialog from 'Event/template/Cards/Speakers/SpeakerEditDialog'
import {PageDescription, PageTitle} from 'Event/template/Cards/Page'
import {useAttendeeVariables} from 'Event'
import {useCardsTemplate} from 'Event/template/Cards'
import Content from 'lib/ui/form/TextEditor/Content'
import CardsPage from 'Event/template/Cards/Page'
import {User} from 'auth/user'

export default function SpeakerPage(props: {
  isEditMode?: boolean
  speakers: Speaker[]
  user: User
}) {
  const {speakers: speakerPageSettings} = useCardsTemplate()
  const v = useAttendeeVariables()

  const content = (
    <>
      <PageTitle aria-label="speakers title">
        {v(speakerPageSettings.title)}
      </PageTitle>
      <PageDescription>
        <Content>{v(speakerPageSettings.description)}</Content>
      </PageDescription>
      <SpeakerEditDialog isEditMode={props.isEditMode} />
      <SpeakerList speakers={props.speakers} isEditMode={props.isEditMode} />
    </>
  )

  if (props.isEditMode) {
    return content
  }

  return <CardsPage user={props.user}>{content}</CardsPage>
}
