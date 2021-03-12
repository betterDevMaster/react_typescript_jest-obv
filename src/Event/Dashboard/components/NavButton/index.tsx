import React, {useState} from 'react'
import styled from 'styled-components'
import ButtonBase from 'lib/ui/Button'
import {Column} from 'lib/ui/layout'
import {HasRules} from 'Event/Dashboard/component-rules'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
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

  if (isAreaButton) {
    return <JoinAreaLink {...props} onJoin={handleClicked} />
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

function JoinAreaLink(props: NavButton & {onJoin: () => void}) {
  const [processing, setProcessing] = useState(false)

  const {event, client} = useEvent()
  const {areaId} = props

  const joinMeeting = () => {
    if (processing) {
      return
    }

    setProcessing(true)

    const url = api(`/events/${event.slug}/areas/${areaId}/join`)
    client
      .get<{url: string}>(url)
      .then((data) => {
        props.onJoin()
        // Got Join URL, open in new window
        window.open(data.url, '_blank')
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  return (
    <Button {...props} disabled={processing} onClick={joinMeeting}>
      {props.text}
    </Button>
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
