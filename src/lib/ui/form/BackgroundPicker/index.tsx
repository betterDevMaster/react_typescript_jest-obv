import GradientColorPicker, {
  parseValues as parseGradientValues,
} from 'lib/ui/form/BackgroundPicker/GradientColorPicker'
import SolidColorPicker from 'lib/ui/form/BackgroundPicker/SolidColorPicker'
import React from 'react'

export type BackgroundPickerProps = {
  label: string
  background?: string
  onChange: (background: string) => void
  disabled?: boolean
}

export default function BackgroundPicker(props: BackgroundPickerProps) {
  const {background, onChange} = props
  const isGradient = background?.startsWith('linear-gradient')

  const handleSwitchToGradient = () => {
    const color1 = background || '#FFFFFF'
    const gradientBg = `linear-gradient(180deg,${color1},#FFFFFF)`
    onChange(gradientBg)
  }

  const switchToSolid = () => {
    const {color1} = parseGradientValues(background)
    onChange(color1)
  }

  if (isGradient) {
    return <GradientColorPicker {...props} onSwitchToSolid={switchToSolid} />
  }

  return (
    <SolidColorPicker {...props} onSwitchToGradient={handleSwitchToGradient} />
  )
}
