import FeatureToggle, {FeatureToggleProps} from 'lib/FeatureToggle'
import {useOwner} from 'organization/OwnerProvider'
import React from 'react'

export default function OrganizationFeatureToggle(props: FeatureToggleProps) {
  const owner = useOwner()

  return <FeatureToggle user={owner} {...props} />
}
