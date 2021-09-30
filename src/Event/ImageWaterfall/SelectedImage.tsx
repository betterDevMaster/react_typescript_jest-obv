import {ImageEntry} from 'organization/Event/ImageEntriesProvider'
import React from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

export default function SelectedImage(props: {
  selected: ImageEntry | null
  next: ImageEntry
  prev: ImageEntry
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const {selected, next, prev} = props

  if (!selected) {
    return null
  }

  return (
    <Lightbox
      mainSrc={selected.file.url}
      nextSrc={next.file.url}
      prevSrc={prev.file.url}
      onCloseRequest={props.onClose}
      onMovePrevRequest={props.onPrev}
      onMoveNextRequest={props.onNext}
    />
  )
}
