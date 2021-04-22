import React, {useState} from 'react'
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

import OfflineDialog from 'lib/ui/OfflineDialog'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useWithAttendeeData} from 'Event/auth/data'

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
  height?: number
  hoverBorderColor?: string
  isAreaButton: boolean
  areaId: number | null
  actionId: string | null
  infusionsoftTag: InfusionsoftTag | null
  offlineTitle?: string
  offlineDescription?: string
  page?: string | null
  fontSize?: number
  padding?: number
  width?: number
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
  const withAttendeeData = useWithAttendeeData()

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
        onClick={handleClicked}
      >
        <Button {...props}>{withAttendeeData(props.text)}</Button>
      </RelativeLink>
    )
  }

  return (
    <StyledAbsoluteLink
      to={withAttendeeData(props.link)}
      disableStyles
      aria-label={props['aria-label']}
      newTab={newTab}
      onClick={handleClicked}
    >
      <Button {...props}>{withAttendeeData(props.text)}</Button>
    </StyledAbsoluteLink>
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
  const [offlineDialogVisible, setOfflineDialogVisible] = useState(false)
  const withAttendeeData = useWithAttendeeData()

  const toggleOfflineDialog = () =>
    setOfflineDialogVisible(!offlineDialogVisible)

  const defaultOfflineTitle = `${withAttendeeData(
    props.text,
  )} Is Currently Offline`

  if (!joinUrl) {
    return (
      <>
        <OfflineDialog
          isOpen={offlineDialogVisible}
          title={withAttendeeData(props.offlineTitle || defaultOfflineTitle)}
          description={withAttendeeData(props.offlineDescription || '')}
          onClose={toggleOfflineDialog}
        />
        <Button {...props} onClick={toggleOfflineDialog} isPending>
          {withAttendeeData(props.text)}
        </Button>
      </>
    )
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
      <Button {...props}>{withAttendeeData(props.text)}</Button>
    </AbsoluteLink>
  )
}

function Button(
  props: {
    children: string | React.ReactElement
    disabled?: boolean
    onClick?: () => void
    isPending?: boolean
  } & NavButton,
) {
  const opacity = props.isPending ? 0.8 : 1

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
      height={props.height}
      onClick={props.onClick}
      opacity={opacity}
      padding={props.padding}
      width={props.width}
      fontSize={props.fontSize}
    >
      {props.children}
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
