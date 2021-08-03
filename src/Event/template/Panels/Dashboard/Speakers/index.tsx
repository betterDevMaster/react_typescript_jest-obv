import React from 'react'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/Panels/Dashboard/Speakers/SpeakerList'
import SpeakerEditDialog from 'Event/template/Panels/Dashboard/Speakers/SpeakerEditDialog'
import {PageTitle} from 'Event/template/Panels/Page'
import {useVariables} from 'Event'
import {usePanels} from 'Event/template/Panels'

export default function SpeakerPage(props: {
  isEditMode?: boolean
  speakers: Speaker[]
}) {
  const {
    template: {speakers: speakerPageSettings},
  } = usePanels()
  const v = useVariables()

  return (
    <>
      <PageTitle aria-label="speakers title">
        {v(speakerPageSettings.title)}
      </PageTitle>
      <SpeakerEditDialog isEditMode={props.isEditMode} />
      <SpeakerList speakers={props.speakers} isEditMode={props.isEditMode} />
    </>
  )
}
