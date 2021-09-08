import React from 'react'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/Panels/Dashboard/Speakers/SpeakerList'
import SpeakerEditDialog from 'Event/template/Panels/Dashboard/Speakers/SpeakerEditDialog'
import {PageTitle} from 'Event/template/Panels/Page'
import {useAttendeeVariables} from 'Event'
import {usePanels} from 'Event/template/Panels'
import SpeakerPageEditDialog from 'Event/template/Panels/Dashboard/Speakers/SpeakerPageConfig/SpeakerPageEditDialog'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'

export default function SpeakerPage(props: {
  isEditMode?: boolean
  speakers: Speaker[]
}) {
  const {
    template: {speakers: speakerPageSettings},
  } = usePanels()
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <SpeakerPageEditDialog visible={configVisible} onClose={toggleConfig} />
      <Editable onEdit={toggleConfig}>
        <PageTitle aria-label="speakers title">
          {v(speakerPageSettings.title)}
        </PageTitle>
      </Editable>
      <SpeakerEditDialog isEditMode={props.isEditMode} />
      <SpeakerList speakers={props.speakers} isEditMode={props.isEditMode} />
    </>
  )
}
