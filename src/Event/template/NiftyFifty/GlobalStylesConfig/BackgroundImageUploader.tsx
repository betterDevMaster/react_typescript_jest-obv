import {
  CustomBackgrounds,
  useNiftyFiftyTemplate,
} from 'Event/template/NiftyFifty'
import ImageAssetUploader from 'lib/asset/ImageAssetUploader'
import React from 'react'
import {Controller, UseFormMethods} from 'react-hook-form'

export default function BackgroundImageUploader(props: {
  label: string
  property: keyof CustomBackgrounds
  control: UseFormMethods['control']
}) {
  const template = useNiftyFiftyTemplate()
  const {control, property, label} = props

  const url = template[property]
  return (
    <Controller
      name={property}
      defaultValue={url}
      control={control}
      render={({value, onChange}) => (
        <ImageAssetUploader
          label={label}
          onChange={onChange}
          value={value}
          canResize
          width={1200}
          height={1920}
        />
      )}
    />
  )
}
