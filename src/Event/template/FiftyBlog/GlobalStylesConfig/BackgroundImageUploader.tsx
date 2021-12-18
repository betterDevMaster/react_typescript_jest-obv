import {CustomBackgrounds, useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import ImageAssetUploader from 'lib/asset/ImageAssetUploader'
import React from 'react'
import {Controller, UseFormMethods} from 'react-hook-form'

export default function BackgroundImageUploader(props: {
  label: string
  property: keyof CustomBackgrounds
  control: UseFormMethods['control']
}) {
  const template = useFiftyBlogTemplate()
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
          width={1920}
          height={1200}
        />
      )}
    />
  )
}
