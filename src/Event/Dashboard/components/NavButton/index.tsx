import React from 'react'
import styled from 'styled-components'
import ButtonBase from 'lib/ui/Button'
import {Column} from 'lib/ui/layout'
import {HasRules} from 'Event/Dashboard/component-rules'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {useJoinUrl} from 'Event/EventProvider'
import {findAction} from 'Event/ActionsProvider/platform-actions'
import {useActions} from 'Event/ActionsProvider'
import {usePoints} from 'Event/PointsProvider'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {InfusionsoftTag, useAddTag} from 'Event/infusionsoft'

export const NAV_BUTTON = 'NAV_BUTTON'

export default interface NavButtonAreaConfig {
  areaId: number | null
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
  hoverBorderColor?: string
  isAreaButton: boolean
  areaId: number | null
  actionId: string | null
  infusionsoftTag: InfusionsoftTag | null
}

export type NavButtonWithSize = NavButton & {
  size: Column
}

export default function NavButton(props: NavButton) {
  const {newTab, isAreaButton} = props
  const submitAction = useSubmitAction(props.actionId)
  const addInfusionsoftTag = useAddInfusionsoftTag(props.infusionsoftTag)

  const handleClicked = () => {
    submitAction()
    addInfusionsoftTag()
  }

  if (isAreaButton && props.areaId) {
    return (
      <JoinAreaButton {...props} areaId={props.areaId} onJoin={handleClicked} />
    )
  }

  return (
    <NormalLink
      to={props.link}
      disableStyles
      aria-label={props['aria-label']}
      newTab={newTab}
      onClick={handleClicked}
    >
      <Button {...props}>{props.text}</Button>
    </NormalLink>
  )
}

function useSubmitAction(actionId: NavButton['actionId']) {
  const actionsList = useActions()
  const {submit} = usePoints()

  return () => {
    if (!actionId) {
      return
    }

    const action = findAction(actionId, actionsList.actions)

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
  props: NavButton & {areaId: number; onJoin: () => void},
) {
  const {areaId} = props
  const joinUrl = useJoinUrl(areaId)

  const button = (
    <Button {...props} disabled={!joinUrl}>
      {props.text}
    </Button>
  )

  if (!joinUrl) {
    return button
  }

  return (
    <AbsoluteLink
      aria-label="start meeting"
      to={joinUrl}
      disabled={!joinUrl}
      newTab
      disableStyles
      onClick={props.onJoin}
    >
      {button}
    </AbsoluteLink>
  )
}

function Button(
  props: {
    children: string | React.ReactElement
    disabled?: boolean
    onClick?: () => void
  } & NavButton,
) {
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
      onClick={props.onClick}
    >
      {props.children}
    </StyledButton>
  )
}

const NormalLink = styled(AbsoluteLink)`
  display: flex;
`

const StyledButton = styled(ButtonBase)`
  font-size: 29px;
  font-weight: 700;
  padding: 15px 30px;

  &:hover {
    opacity: 0.8;
  }
`
