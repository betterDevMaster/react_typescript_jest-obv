import {CustomBackgrounds, useCards} from 'Event/template/Cards'
import ImageAssetUploader from 'lib/asset/ImageAssetUploader'
import React from 'react'

export default function BackgroundImageUploader(props: {
  label: string
  property: keyof CustomBackgrounds
}) {
  const {template, update} = useCards()
  const value = template[props.property]

  return (
    <ImageAssetUploader
      label={props.label}
      onChange={update.primitive(props.property)}
      value={value}
      canResize
      width={1920}
      height={1200}
    />
  )
}
