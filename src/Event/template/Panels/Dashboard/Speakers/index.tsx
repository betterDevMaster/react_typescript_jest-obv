import React from 'react'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/Panels/Dashboard/Speakers/SpeakerList'
import SpeakerEditDialog from 'Event/template/Panels/Dashboard/Speakers/SpeakerEditDialog'
import {PageDescription, PageTitle} from 'Event/template/Panels/Page'
import {useAttendeeVariables} from 'Event'
import {usePanels} from 'Event/template/Panels'
import SpeakerPageEditDialog from 'Event/template/Panels/Dashboard/Speakers/SpeakerPageConfig/SpeakerPageEditDialog'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Content from 'lib/ui/form/TextEditor/Content'

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
      <PageDescription>
        <Content>{v(speakerPageSettings.description)}</Content>
      </PageDescription>
      <SpeakerEditDialog isEditMode={props.isEditMode} />
      <SpeakerList speakers={props.speakers} isEditMode={props.isEditMode} />
    </>
  )
}
