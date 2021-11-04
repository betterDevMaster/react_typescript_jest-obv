import {ImageMasonryWall, useFetchEntries} from 'Event/ImageWaterfall'
import {PageDescription, PageTitle} from 'Event/template/Panels/Page'

import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import React from 'react'
import TextContent from 'lib/ui/form/TextEditor/Content'
import {useAttendeeVariables} from 'Event'
import {usePanels} from 'Event/template/Panels'
import {useToggle} from 'lib/toggle'
import PanelsImageWaterfallConfig from 'Event/template/Panels/Dashboard/ImageWaterfall/ImageWaterfallConfig'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import ComponentConfig from 'organization/Event/DashboardConfig/ComponentConfig'

export default function PanelsImageWaterfall() {
  const {loading, entries} = useFetchEntries()
  const {
    template: {imageWaterfall: pageSettings},
  } = usePanels()
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <>
      <ComponentConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        title="Image Waterfall"
      >
        <PanelsImageWaterfallConfig onClose={toggleConfig} />
      </ComponentConfig>
      <Editable onEdit={toggleConfig}>
        <PageTitle>{v(pageSettings.title)}</PageTitle>
      </Editable>
      <PageDescription>
        <TextContent>{v(pageSettings?.description)}</TextContent>
      </PageDescription>
      <ImageMasonryWall entries={entries} />
    </>
  )
}
