import MenuItem, {MenuItemProps} from '@material-ui/core/MenuItem'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {obvioRoutes} from 'obvio/Routes'
import React from 'react'
import CreditBalance from 'obvio/Billing/CreditBalance'

/**
 * MUI forwards refs to MenuItem(s) so we have to forward
 * them here. The actual type is crazy long, since it's
 * in MUI domain we'll just 'any' type it.
 */
const CreditsMenuItem = React.forwardRef<MenuItemProps, any>((props, ref) => {
  return (
    <MenuItem ref={ref} {...props}>
      <RelativeLink
        to={obvioRoutes.billing.root}
        disableStyles
        aria-label="billing settings"
      >
        <CreditBalance />
      </RelativeLink>
    </MenuItem>
  )
})

export default CreditsMenuItem
