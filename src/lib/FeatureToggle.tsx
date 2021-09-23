import React from 'react'
import {TeamMember} from 'auth/user'

export type FeatureToggleProps = {
  disabled: React.ReactElement
  enabled: React.ReactElement
  flags?: string
}

/**
 * A component used to evaluate the available flags of a supplied user, to
 * determine which component to return.
 *
 * @param disabled React.ReactElement
 * @param enabled React.ReactElement
 * @param flag string
 * @returns React.ReactElement
 */
export default function FeatureToggle(
  props: FeatureToggleProps & {
    user: TeamMember
  },
) {
  const {user, flags, disabled, enabled} = props

  // If the user doesn't have any flags to compare, there's nothing else to do
  // except render the "disabled" component.
  if (user.feature_flags === null) {
    return disabled
  }

  // Because the "flag" value can be a comma-separated value of flags, we'll
  // split the value so we have an array to iterate.
  const possibleFlags = flags?.split(',') || []
  // Getting it local to maneuver type considerations.
  const availableFlags = user.feature_flags || []
  // Default to the "disabled" component for a return value.
  let result = disabled

  // Iterate the array of possible flags that should return us an "enabled"
  // component, to see if ANY of them exist in the availableFlags array.
  for (const flag of possibleFlags) {
    const isEnabled = availableFlags.includes(flag.trim())

    if (isEnabled) {
      result = enabled
      break
    }
  }

  return result
}
