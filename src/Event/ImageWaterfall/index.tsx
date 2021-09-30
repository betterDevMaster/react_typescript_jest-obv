import React, {useCallback, useState} from 'react'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
import styled from 'styled-components'
import 'react-image-lightbox/style.css'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import Content from 'lib/ui/form/TextEditor/Content'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useTemplate} from 'Event/TemplateProvider'
import {useAttendeeVariables} from 'Event'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import SelectedImage from 'Event/ImageWaterfall/SelectedImage'
import {useAsync} from 'lib/async'
import {ImageEntry} from 'organization/Event/ImageEntriesProvider'

export default function ImageWaterfall() {
  const {loading, entries} = useFetchEntries()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const template = useTemplate()
  const {imageWaterfall: settings} = template

  const v = useAttendeeVariables()

  const clearSelected = () => {
    setSelectedIndex(null)
  }

  const select = (index: number) => {
    setSelectedIndex(index)
  }

  if (loading) {
    return <FullPageLoader />
  }

  const isEmpty = entries.length === 0
  if (isEmpty) {
    return (
      <Container>
        <p>No entries have been submitted/approved.</p>
      </Container>
    )
  }

  const numEntries = entries.length
  const nextIndex = has(selectedIndex) ? (selectedIndex + 1) % numEntries : 0
  const next = entries[nextIndex]
  const prevIndex = has(selectedIndex)
    ? (selectedIndex + numEntries - 1) % numEntries
    : 0
  const prev = entries[prevIndex]
  const selected = has(selectedIndex) ? entries[selectedIndex] : null

  const selectNext = () => setSelectedIndex(nextIndex)
  const selectPrev = () => setSelectedIndex(prevIndex)

  return (
    <Container>
      <Title>{v(settings.title)}</Title>
      <Description>
        <Content>{v(settings.description)}</Content>
      </Description>
      <BackToDashboardBox color={settings.backToDashboardTextColor}>
        <BackToDashboardLink
          color={settings.backToDashboardTextColor}
          to={eventRoutes.root}
        >
          {v(settings.backToDashboardText)}
        </BackToDashboardLink>
      </BackToDashboardBox>
      <ResponsiveMasonry columnsCountBreakPoints={{350: 3, 900: 5}}>
        <Masonry gutter="10px">
          {entries.map((entry: ImageEntry, index: number) => (
            <ClickableImage
              key={entry.id}
              src={entry.file.url}
              alt={entry.title}
              onClick={() => select(index)}
              aria-label="entry"
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
      <SelectedImage
        selected={selected}
        onClose={clearSelected}
        onNext={selectNext}
        onPrev={selectPrev}
        next={next}
        prev={prev}
      />
    </Container>
  )
}

function useFetchEntries() {
  const {client, event} = useEvent()
  const url = api(`/events/${event.slug}/image_entries/display`)

  const request = useCallback(() => client.get<ImageEntry[]>(url), [
    client,
    url,
  ])

  const {loading, data} = useAsync(request)
  return {loading, entries: data || []}
}

function has(index: number | null): index is number {
  return index !== null
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
`

const ClickableImage = styled.img`
  cursor: 'pointer';
  width: 100%;
  display: block;
`

const Title = styled.h2`
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`

const Description = styled.div`
  text-align: center;
  margin: 20px 20px;
`

const BackToDashboardBox = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const BackToDashboardLink = styled(RelativeLink)<{color: string}>`
  line-height: 1.5;
  color: ${(props) => props.color};
`
