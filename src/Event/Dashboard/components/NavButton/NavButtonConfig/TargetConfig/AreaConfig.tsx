import React from 'react'
import AreaSelect from 'organization/Event/Area/AreaSelect'
import {ButtonConfigProps} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import NavButton from 'Event/Dashboard/components/NavButton'

export default function AreaConfig<T extends NavButton>(
  props: ButtonConfigProps<T>,
) {
  const {button, update} = props
  if (!button.isAreaButton) {
    return null
  }

  return <AreaSelect value={button.areaId} onPick={update('areaId')} />
}
