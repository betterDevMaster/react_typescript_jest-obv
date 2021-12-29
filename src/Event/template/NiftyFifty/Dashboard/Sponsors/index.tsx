import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList'
import SponsorEditDialog from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorEditDialog'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useToggle} from 'lib/toggle'
import {useAttendeeVariables} from 'Event'
import {PageTitle, PageDescription} from 'Event/template/NiftyFifty/Page'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import PageSettingsDialog from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorPageConfig/PageSettingsDialog'
import Content from 'lib/ui/form/TextEditor/Content'

export default function NiftyFiftySponsorPage(props: {
  isEditMode?: boolean
  sponsors: Sponsor[]
}) {
  const {sponsors: sponsorsPageSettings} = useNiftyFiftyTemplate()
  const {sponsors} = props
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <EditModeOnly>
        <PageSettingsDialog visible={configVisible} onClose={toggleConfig} />
      </EditModeOnly>
      <Editable onEdit={toggleConfig}>
        <PageTitle aria-label="sponsors title">
          {v(sponsorsPageSettings.title)}
        </PageTitle>
      </Editable>
      <PageDescription aria-label="sponsors description">
        <Content>{v(sponsorsPageSettings.description)}</Content>
      </PageDescription>
      <SponsorEditDialog isEditMode={props.isEditMode} />
      <SponsorList sponsors={sponsors} isEditMode={props.isEditMode} />
    </>
  )
}
