import GradientColorPicker, {
  parseValues as parseGradientValues,
} from 'lib/ui/form/BackgroundPicker/GradientColorPicker'
import ImagePicker from 'lib/ui/form/BackgroundPicker/ImagePicker'
import SolidColorPicker from 'lib/ui/form/BackgroundPicker/SolidColorPicker'
import React from 'react'

export type BackgroundPickerProps = {
  label: string
  background?: string
  onChange: (background: string) => void
  disabled?: boolean
}

export default function BackgroundPicker(props: BackgroundPickerProps) {
  return (
    <>
      <ColorPickers {...props} />
      <ImagePicker {...props} />
    </>
  )
}

function ColorPickers(props: BackgroundPickerProps) {
  const {background, onChange} = props
  const isGradient = background?.startsWith('linear-gradient')
  const isImage = background?.startsWith('url')

  const handleSwitchToGradient = () => {
    const color1 = background || '#FFFFFF'
    const gradientBg = `linear-gradient(180deg,${color1},#FFFFFF)`
    onChange(gradientBg)
  }

  const switchToSolid = () => {
    const {color1} = parseGradientValues(background)
    onChange(color1)
  }

  if (isImage) {
    return null
  }

  if (isGradient) {
    return <GradientColorPicker {...props} onSwitchToSolid={switchToSolid} />
  }

  return (
    <SolidColorPicker {...props} onSwitchToGradient={handleSwitchToGradient} />
  )
}
