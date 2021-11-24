import React from 'react'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/Panels/Dashboard/Speakers/SpeakerList'
import SpeakerEditDialog from 'Event/template/Panels/Dashboard/Speakers/SpeakerEditDialog'
import {PageDescription, PageTitle} from 'Event/template/Panels/Page'
import {useAttendeeVariables} from 'Event'
import {usePanelsTemplate} from 'Event/template/Panels'
import SpeakerPageEditDialog from 'Event/template/Panels/Dashboard/Speakers/SpeakerPageConfig/SpeakerPageEditDialog'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Content from 'lib/ui/form/TextEditor/Content'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'

export default function SpeakerPage(props: {
  isEditMode?: boolean
  speakers: Speaker[]
}) {
  const {speakers: speakerPageSettings} = usePanelsTemplate()
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <EditModeOnly>
        <SpeakerPageEditDialog visible={configVisible} onClose={toggleConfig} />
      </EditModeOnly>
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
