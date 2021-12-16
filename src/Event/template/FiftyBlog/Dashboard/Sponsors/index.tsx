import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import SponsorList from 'Event/template/FiftyBlog/Dashboard/Sponsors/SponsorList'
import SponsorEditDialog from 'Event/template/FiftyBlog/Dashboard/Sponsors/SponsorEditDialog'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useToggle} from 'lib/toggle'
import {useAttendeeVariables} from 'Event'
import {PageTitle, PageDescription} from 'Event/template/FiftyBlog/Page'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import PageSettingsDialog from 'Event/template/FiftyBlog/Dashboard/Sponsors/SponsorPageConfig/PageSettingsDialog'
import Content from 'lib/ui/form/TextEditor/Content'

export default function FiftyBlogSponsorPage(props: {
  isEditMode?: boolean
  sponsors: Sponsor[]
}) {
  const {sponsors: sponsorsPageSettings} = useFiftyBlogTemplate()
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
