import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/Panels/Dashboard/Sponsors/SponsorList'
import SponsorEditDialog from 'Event/template/Panels/Dashboard/Sponsors/SponsorEditDialog'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'

import {useToggle} from 'lib/toggle'
import {useAttendeeVariables} from 'Event'
import {PageTitle} from 'Event/template/Panels/Page'
import {usePanels} from 'Event/template/Panels'
import PageSettingsDialog from 'Event/template/Panels/Dashboard/Sponsors/SponsorPageConfig/PageSettingsDialog'

export default function PanelsSponsorPage(props: {
  isEditMode?: boolean
  sponsors: Sponsor[]
}) {
  const {
    template: {sponsors: sponsorsPageSettings},
  } = usePanels()
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
      <SponsorEditDialog isEditMode={props.isEditMode} />
      <SponsorList sponsors={sponsors} isEditMode={props.isEditMode} />
    </>
  )
}
