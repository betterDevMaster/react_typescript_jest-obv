import Box from '@material-ui/core/Box'
import MuiButton from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import {useEvent} from 'Event/EventProvider'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {ENTERPRISE} from 'obvio/Billing/plans'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {IfOwnerHasPlan} from 'organization/OwnerProvider'
import React from 'react'

export default function AdditionalWaiversButton() {
  const routes = useEventRoutes()
  const {hasWaiver} = useEvent()

  return (
    <IfOwnerHasPlan plan={ENTERPRISE}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <RelativeLink
          disableStyles
          to={routes.waiver.additional_waivers}
          disabled={!hasWaiver}
        >
          <Content />
        </RelativeLink>
      </Box>
    </IfOwnerHasPlan>
  )
}

function Content() {
  const {hasWaiver} = useEvent()
  if (!hasWaiver) {
    return (
      <Tooltip title="Default waiver required.">
        <div>
          <Button disabled />
        </div>
      </Tooltip>
    )
  }

  return <Button />
}

function Button(props: {disabled?: boolean}) {
  return (
    <MuiButton variant="outlined" color="primary" disabled={props.disabled}>
      Additional waivers
    </MuiButton>
  )
}
