import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import React from 'react'
import AreaSelect from 'organization/Event/Area/AreaSelect'

export default function AreaConfig(props: {
  button: NavButtonWithSize
  update: <T extends keyof NavButtonWithSize>(
    key: T,
  ) => (value: NavButtonWithSize[T]) => void
}) {
  if (!props.button.isAreaButton) {
    return null
  }

  return (
    <AreaSelect value={props.button.areaId} onPick={props.update('areaId')} />
  )
}
