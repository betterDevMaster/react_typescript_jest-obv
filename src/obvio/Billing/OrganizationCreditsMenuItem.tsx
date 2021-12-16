import MenuItem, {MenuItemProps} from '@material-ui/core/MenuItem'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import React from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import {
  PURCHASE_CREDITS,
  usePermissions,
} from 'organization/PermissionsProvider'
import OrganizationCreditBalance from './OrganizationCreditBalance'

const OrganizationCreditsMenuItem = React.forwardRef<MenuItemProps, any>(
  (props, ref) => {
    const {can} = usePermissions()
    const {routes} = useOrganization()

    if (!can(PURCHASE_CREDITS)) {
      return null
    }

    return (
      <MenuItem ref={ref} {...props}>
        <RelativeLink
          to={routes.settings}
          disableStyles
          aria-label="organization settings"
        >
          <OrganizationCreditBalance />
        </RelativeLink>
      </MenuItem>
    )
  },
)

export default OrganizationCreditsMenuItem
