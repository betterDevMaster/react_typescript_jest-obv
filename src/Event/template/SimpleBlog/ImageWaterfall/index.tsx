import {useAttendee} from 'Event/auth'
import {ImageMasonryWall, useFetchEntries} from 'Event/ImageWaterfall'
import Page, {
  BackToDashboardLink,
  PageTitle,
  PageDescription,
} from 'Event/template/SimpleBlog/Page'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import React from 'react'
import TextContent from 'lib/ui/form/TextEditor/Content'
import {useAttendeeVariables} from 'Event'
import {eventRoutes} from 'Event/Routes'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'

export default function SimpleBlogImageWaterfall() {
  const user = useAttendee()
  const {loading, entries} = useFetchEntries()
  const {imageWaterfall: pageSettings} = useSimpleBlogTemplate()
  const v = useAttendeeVariables()

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <Page user={user}>
      <PageTitle>{v(pageSettings.title)}</PageTitle>
      <PageDescription>
        <TextContent>{v(pageSettings?.description)}</TextContent>
      </PageDescription>
      <BackToDashboardLink
        color={pageSettings.backToDashboardTextColor}
        to={eventRoutes.root}
      >
        {v(pageSettings.backToDashboardText)}
      </BackToDashboardLink>
      <ImageMasonryWall entries={entries} />
    </Page>
  )
}
