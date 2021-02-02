import Switch from '@material-ui/core/Switch'
import {Action} from 'Event/ActionsProvider'
import {onChangeCheckedHandler} from 'lib/dom'
import {useSetActive} from 'organization/Event/PointsConfig/active'
import React from 'react'

export default function ActiveSwitch(props: {
  action: Action
  setProcessing: (processing: boolean) => void
  processing: boolean
}) {
  const setActive = useSetActive()

  const handleCheck = (active: boolean) => {
    props.setProcessing(true)
    setActive(active, props.action).finally(() => {
      props.setProcessing(false)
    })
  }

  return (
    <Switch
      disabled={props.processing}
      checked={props.action.is_active}
      onChange={onChangeCheckedHandler(handleCheck)}
      color="primary"
      inputProps={{
        'aria-label': 'toggle action active',
      }}
    />
  )
}
