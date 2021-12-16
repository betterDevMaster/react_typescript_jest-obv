import {ImageMasonryWall, useFetchEntries} from 'Event/ImageWaterfall'
import {PageDescription, PageTitle} from 'Event/template/FiftyBlog/Page'

import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import React from 'react'
import TextContent from 'lib/ui/form/TextEditor/Content'
import {useAttendeeVariables} from 'Event'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {useToggle} from 'lib/toggle'
import FiftyBlogImageWaterfallConfig from 'Event/template/FiftyBlog/Dashboard/ImageWaterfall/ImageWaterfallConfig'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import ComponentConfig from 'organization/Event/DashboardConfig/ComponentConfig'

export default function FiftyBlogImageWaterfall() {
  const {loading, entries} = useFetchEntries()
  const {imageWaterfall: pageSettings} = useFiftyBlogTemplate()
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
        <FiftyBlogImageWaterfallConfig onClose={toggleConfig} />
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
