import React from 'react'
import AreaSelect from 'organization/Event/Area/AreaSelect'
import {TargetConfigProps} from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'

export default function AreaConfig(props: TargetConfigProps) {
  const {areaId, setAreaId, isAreaButton} = props
  if (!isAreaButton) {
    return null
  }

  return <AreaSelect value={areaId} onPick={setAreaId} />
}
