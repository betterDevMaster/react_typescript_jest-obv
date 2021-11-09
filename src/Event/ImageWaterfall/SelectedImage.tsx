import {ImageEntry} from 'organization/Event/ImageEntriesProvider'
import React from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

export default function SelectedImage(props: {
  selected: ImageEntry | null
  next?: ImageEntry
  prev?: ImageEntry
  onClose: () => void
  onPrev?: () => void | undefined
  onNext?: () => void | undefined
  appBarPresent?: boolean
}) {
  const {appBarPresent, selected, next, prev, onClose, onNext, onPrev} = props

  if (!selected) {
    return null
  }

  const nextSrc = next?.file.url
  const prevSrc = prev?.file.url

  // If the appBarPresent prop is defined, we need to add some space on the top
  // of the reactModal that the Lightbox component uses. This is due to OUR
  // app bar being on top of everything (z-index), the close button of the
  // Lightbox renders underneath and is not accessible.
  const modalStyle = appBarPresent
    ? {
        overlay: {
          top: '64px',
        },
      }
    : undefined

  return (
    <Lightbox
      mainSrc={selected.file.url}
      nextSrc={nextSrc}
      prevSrc={prevSrc}
      onCloseRequest={onClose}
      onMovePrevRequest={onPrev}
      onMoveNextRequest={onNext}
      reactModalStyle={modalStyle}
      enableZoom={false}
    />
  )
}
