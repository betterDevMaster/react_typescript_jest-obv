import React, {useCallback, useState} from 'react'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
import styled from 'styled-components'
import 'react-image-lightbox/style.css'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useTemplate} from 'Event/TemplateProvider'
import SelectedImage from 'Event/ImageWaterfall/SelectedImage'
import {useAsync} from 'lib/async'
import {ImageEntry} from 'organization/Event/ImageEntriesProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogImageWaterfall from 'Event/template/SimpleBlog/ImageWaterfall'
import {CARDS} from 'Event/template/Cards'
import CardsImageWaterfall from 'Event/template/Cards/ImageWaterfall'
import {PANELS} from 'Event/template/Panels'
import PanelsImageWaterfall from 'Event/template/Panels/Dashboard/ImageWaterfall'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'
import FiftyBlogImageWaterfall from 'Event/template/FiftyBlog/Dashboard/ImageWaterfall'

export default function ImageWaterfall() {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogImageWaterfall />
    case CARDS:
      return <CardsImageWaterfall />
    case PANELS:
      return <PanelsImageWaterfall />
    case FIFTY_BLOG:
      return <FiftyBlogImageWaterfall />
    default:
      throw new Error(`ImageWaterfall not implemented for template: ${name}`)
  }
}

export function ImageMasonryWall(props: {entries: ImageEntry[]}) {
  const {entries} = props
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const clearSelected = () => {
    setSelectedIndex(null)
  }

  const select = (index: number) => {
    setSelectedIndex(index)
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
    <Box>
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
    </Box>
  )
}

export function useFetchEntries() {
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

const ClickableImage = styled.img`
  cursor: 'pointer';
  width: 100%;
  display: block;
`

const Box = styled.div`
  width: 100%;
`
