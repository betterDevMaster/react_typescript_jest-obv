import FeatureToggle, {FeatureToggleProps} from 'lib/FeatureToggle'
import {useObvioUser} from 'obvio/auth'
import React from 'react'

export default function UserFeatureToggle(props: FeatureToggleProps) {
  const user = useObvioUser()

  return <FeatureToggle user={user} {...props} />
}
