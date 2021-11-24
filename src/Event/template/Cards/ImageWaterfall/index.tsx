import {ImageMasonryWall, useFetchEntries} from 'Event/ImageWaterfall'

import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import React from 'react'
import TextContent from 'lib/ui/form/TextEditor/Content'
import {useAttendeeVariables} from 'Event'
import {useCardsTemplate} from 'Event/template/Cards'
import {PageDescription, PageTitle} from 'Event/template/Cards/Page'
import CardsPage from 'Event/template/Cards/Page'
import {useAttendee} from 'Event/auth'

export default function CardsImageWaterfall() {
  const user = useAttendee()

  const {loading, entries} = useFetchEntries()
  const {imageWaterfall: pageSettings} = useCardsTemplate()
  const v = useAttendeeVariables()

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <CardsPage user={user}>
      <PageTitle>{v(pageSettings.title)}</PageTitle>
      <PageDescription>
        <TextContent>{v(pageSettings?.description)}</TextContent>
      </PageDescription>
      <ImageMasonryWall entries={entries} />
    </CardsPage>
  )
}
