import React from 'react'
import styled from 'styled-components'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useLocation} from 'react-router-dom'
import {useEventRoutes} from 'organization/Event/EventRoutes'

export default function ConfigNavItem(props: {
  to: string
  'aria-label': string
  children: string
  newTab?: boolean
}) {
  const {to} = props
  const isSubpath = useIsSubpath()

  const location = useLocation()
  const eventRoutes = useEventRoutes()

  const isActive =
    props.to === location.pathname ||
    isSubpath(to === eventRoutes.areas.root, 'areas') ||
    isSubpath(to === eventRoutes.services.root, 'services') ||
    isSubpath(to === eventRoutes.forms.root, 'forms')

  return (
    <ConfigLink
      to={props.to}
      active={isActive}
      aria-label={props['aria-label']}
      newTab={props.newTab}
    >
      {props.children}
    </ConfigLink>
  )
}

/**
 * Check if the current URL location is a child of the config nav
 * item. ie. If we're viewing a nested area, we'd like to
 * highlight the 'areas' link.
 *
 * @returns
 */
function useIsSubpath() {
  const location = useLocation()
  const paths = location.pathname.split('/')

  return (isLink: boolean, key: string) => {
    const isLocation = Boolean(paths.find((p) => p === key))
    return isLocation && isLink
  }
}

const ConfigLink = styled((props) => {
  const {active: _, ...otherProps} = props
  return <RelativeLink {...otherProps} />
})<{active: boolean}>`
  margin-right: ${(props) => props.theme.spacing[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  color: ${(props) => (props.active ? '#000000' : '#707070')};
  display: inline-block;
`
