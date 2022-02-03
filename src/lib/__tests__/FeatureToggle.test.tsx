import React from 'react'
import {render} from '__utils__/render'
import FeatureToggle from 'lib/FeatureToggle'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

it('should render enabled component when owner has flag', async () => {
  const EnabledComponent = <div data-testid="enabled" />
  const DisabledComponent = <div data-testid="disabled" />

  const user = fakeTeamMember({
    feature_flags: ['hasFlag'],
  })

  const {findByTestId} = render(
    <FeatureToggle
      user={user}
      flags="hasFlag"
      enabled={EnabledComponent}
      disabled={DisabledComponent}
    />,
  )

  expect(await findByTestId('enabled')).toBeInTheDocument()
})

it('should render disabled component when owner is missing flag', async () => {
  const EnabledComponent = <div data-testid="enabled" />
  const DisabledComponent = <div data-testid="disabled" />

  const user = fakeTeamMember({
    feature_flags: [],
  })

  const {findByTestId} = render(
    <FeatureToggle
      user={user}
      flags="missingFlag"
      enabled={EnabledComponent}
      disabled={DisabledComponent}
    />,
  )

  expect(await findByTestId('disabled')).toBeInTheDocument()
})

it('should render enabled component when many flags possible', async () => {
  const user = fakeTeamMember({
    feature_flags: ['theFlag'],
  })

  const EnabledComponent = <div data-testid="enabled" />
  const DisabledComponent = <div data-testid="disabled" />

  const {findByTestId} = render(
    <FeatureToggle
      user={user}
      flags="oneFlag,twoFlag,theFlag"
      enabled={EnabledComponent}
      disabled={DisabledComponent}
    />,
  )

  expect(await findByTestId('enabled')).toBeInTheDocument()
})
