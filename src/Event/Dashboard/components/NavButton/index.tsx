import React from 'react'
import styled from 'styled-components'
import ButtonBase from 'lib/ui/Button'
import {Column} from 'lib/ui/layout'
import {HasRules} from 'Event/visibility-rules'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {findAction} from 'Event/ActionsProvider/platform-actions'
import {useActions} from 'Event/ActionsProvider'
import {usePoints} from 'Event/PointsProvider'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {InfusionsoftTag, useAddTag} from 'Event/infusionsoft'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {areaRoutes} from 'Event/Routes'
import {useVariables} from 'Event'
import {Icon} from 'lib/fontawesome/Icon'

export const NAV_BUTTON = 'NAV_BUTTON'

export default interface NavButtonAreaConfig {
  areaId: string | null
}

export default interface NavButton extends HasRules, Publishable {
  text: string
  link: string
  backgroundColor?: string
  textColor?: string
  newTab?: boolean
  'aria-label'?: string
  className?: string
  hoverBackgroundColor?: string
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  height?: number
  hoverBorderColor?: string
  isAreaButton: boolean
  areaId: string | null
  actionId: string | null
  infusionsoftTag: InfusionsoftTag | null
  page?: string | null
  fontSize?: number
  padding?: number
  width?: number
  icon?: string | null
}

export type NavButtonWithSize = NavButton & {
  size: Column
  newLine?: boolean
}
export const DEFAULT_BUTTON_HEIGHT = 64

export default function NavButton(props: NavButton) {
  const {newTab, isAreaButton} = props
  const submitAction = useSubmitAction(props.actionId)
  const addInfusionsoftTag = useAddInfusionsoftTag(props.infusionsoftTag)
  const v = useVariables()

  const handleClicked = () => {
    submitAction()
    addInfusionsoftTag()
  }

  if (isAreaButton && props.areaId) {
    return (
      <JoinAreaButton {...props} areaId={props.areaId} onJoin={handleClicked} />
    )
  }

  if (props.page) {
    return (
      <RelativeLink
        to={props.page}
        disableStyles
        aria-label={props['aria-label']}
        newTab={props.newTab}
        onClick={handleClicked}
      >
        <Button {...props} />
      </RelativeLink>
    )
  }

  return (
    <StyledAbsoluteLink
      to={v(props.link)}
      disableStyles
      aria-label={props['aria-label']}
      newTab={newTab}
      onClick={handleClicked}
    >
      <Button {...props} />
    </StyledAbsoluteLink>
  )
}

function useSubmitAction(actionKey: NavButton['actionId']) {
  const actionsList = useActions()
  const {submit} = usePoints()

  return () => {
    if (!actionKey) {
      return
    }

    const action = findAction(actionKey, actionsList.actions)
    if (!action) {
      return
    }

    submit(action)
  }
}

function useAddInfusionsoftTag(tag: NavButton['infusionsoftTag']) {
  const addTag = useAddTag()

  return () => {
    if (!tag) {
      return
    }

    addTag(tag)
  }
}

function JoinAreaButton(
  props: NavButton & {
    areaId: string
    onJoin: () => void
  },
) {
  const {areaId} = props
  const joinLink = areaRoutes(areaId).root

  return (
    <RelativeLink to={joinLink} newTab>
      <Button {...props} onClick={props.onJoin} />
    </RelativeLink>
  )
}

function Button(
  props: {
    disabled?: boolean
    onClick?: () => void
    isPending?: boolean
  } & NavButton,
) {
  const opacity = props.isPending ? 0.8 : 1
  const v = useVariables()

  return (
    <StyledButton
      disabled={props.disabled}
      fullWidth
      textTransform="uppercase"
      backgroundColor={props.backgroundColor}
      textColor={props.textColor}
      className={props.className}
      hoverBackgroundColor={props.hoverBackgroundColor}
      disableHover={!props.hoverBackgroundColor}
      borderRadius={props.borderRadius}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
      hoverBorderColor={props.hoverBorderColor}
      minHeight={props.height}
      onClick={props.onClick}
      opacity={opacity}
      padding={props.padding}
      width={props.width}
      fontSize={props.fontSize}
    >
      <>
        <StyledIcon iconClass={props.icon} color={props.textColor} />
        {v(props.text)}
      </>
    </StyledButton>
  )
}

const StyledAbsoluteLink = styled(AbsoluteLink)`
  display: flex;
  justify-content: center;
`

const StyledButton = styled(ButtonBase)`
  font-size: 29px;
  font-weight: 700;
  padding: 15px 30px;

  &:hover {
    opacity: 0.8;
  }
`

const StyledIcon = styled(Icon)`
  margin-right: ${(props) => props.theme.spacing[2]};
`
