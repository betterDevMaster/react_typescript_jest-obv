import React from 'react'
import {Speaker} from 'Event/SpeakerPage'
import SpeakerList from 'Event/template/NiftyFifty/Dashboard/Speakers/SpeakerList'
import SpeakerEditDialog from 'Event/template/NiftyFifty/Dashboard/Speakers/SpeakerEditDialog'
import {PageDescription, PageTitle} from 'Event/template/NiftyFifty/Page'
import {useAttendeeVariables} from 'Event'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import SpeakerPageEditDialog from 'Event/template/NiftyFifty/Dashboard/Speakers/SpeakerPageConfig/SpeakerPageEditDialog'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Content from 'lib/ui/form/TextEditor/Content'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'

export default function SpeakerPage(props: {
  isEditMode?: boolean
  speakers: Speaker[]
}) {
  const {speakers: speakerPageSettings} = useNiftyFiftyTemplate()
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <EditModeOnly>
        <SpeakerPageEditDialog visible={configVisible} onClose={toggleConfig} />
      </EditModeOnly>
      <Editable onEdit={toggleConfig}>
        <PageTitle
          color={speakerPageSettings.welcomeTitleColor}
          size={speakerPageSettings.welcomeTitleFontSize}
          aria-label="speakers title"
        >
          {v(speakerPageSettings.title)}
        </PageTitle>
      </Editable>
      <PageDescription
        aria-label="speakers description"
        color={speakerPageSettings.welcomeDescriptionColor}
        size={speakerPageSettings.welcomeDescriptionFontSize}
      >
        <Content>{v(speakerPageSettings.description)}</Content>
      </PageDescription>
      <SpeakerEditDialog isEditMode={props.isEditMode} />
      <SpeakerList speakers={props.speakers} isEditMode={props.isEditMode} />
    </>
  )
}
