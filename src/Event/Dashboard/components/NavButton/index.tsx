import React from 'react'
import styled from 'styled-components'
import ButtonBase from 'lib/ui/Button'
import {Column} from 'lib/ui/layout'
import {HasRules} from 'Event/attendee-rules'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {findAction} from 'Event/ActionsProvider/platform-actions'
import {useActions} from 'Event/ActionsProvider'
import {usePoints} from 'Event/PointsProvider'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {
  InfusionsoftTag,
  useAddTag as useAddInfusionsoftTag,
} from 'Event/infusionsoft'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {areaRoutes} from 'Event/Routes'
import {useAttendeeVariables} from 'Event'
import {Icon, IconProps} from 'lib/fontawesome/Icon'
import ImageEntryUpload from 'Event/Dashboard/components/NavButton/ImageEntryUpload'
import {MailchimpTag, useAddTag as useAddMailchimpTag} from 'Event/mailchimp'
import {ZapierTag, useAddTag as useAddZapierTag} from 'Event/zapier'
import {Ordered} from 'lib/list'

export const NAV_BUTTON = 'NAV_BUTTON'

export default interface NavButtonAreaConfig {
  areaId: string | null
}

export default interface NavButton extends HasRules, Publishable, Ordered {
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
  isImageUpload: boolean
  areaId: string | null
  actionId: string | null
  infusionsoftTag: InfusionsoftTag | null
  page?: string | null
  fontSize?: number
  padding?: number
  width?: number
  icon?: string | null
  iconSize?: number
  iconStacked?: boolean
  mailchimpTag: MailchimpTag | null
  zapierTag: ZapierTag | null
}

export type NavButtonWithSize = NavButton & {
  size: Column
  newLine?: boolean
}
export const DEFAULT_BUTTON_HEIGHT = 64
export const DEFAULT_FONT_SIZE = 29
const DEFAULT_ICON_COLOR = '#ffffff'

export default function NavButton(props: NavButton) {
  const {newTab, isAreaButton, isImageUpload} = props
  const submitAction = useSubmitAction(props.actionId)
  const addInfusionsoftTag = useAddInfusionsoftTag()
  const addMailchimpTag = useAddMailchimpTag()
  const addZapierTag = useAddZapierTag()

  const v = useAttendeeVariables()

  const handleClicked = () => {
    submitAction()

    if (props.infusionsoftTag) {
      addInfusionsoftTag(props.infusionsoftTag)
    }

    if (props.mailchimpTag) {
      addMailchimpTag(props.mailchimpTag)
    }

    if (props.zapierTag) {
      addZapierTag(props.zapierTag)
    }
  }

  // Button may have been removed, but a property was set
  // after the fact. This would show up as an empty
  // button so let's just render null.
  const wasRemoved = Object.keys(props).length === 1
  if (wasRemoved) {
    return null
  }

  if (isImageUpload) {
    return <ImageEntryUpload {...props} />
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

function JoinAreaButton(
  props: NavButton & {
    areaId: string
    onJoin: () => void
  },
) {
  const {areaId} = props
  const joinLink = areaRoutes(areaId).root

  return (
    <RelativeLink to={joinLink} newTab disableStyles>
      <Button {...props} onClick={props.onJoin} />
    </RelativeLink>
  )
}

export function Button(
  props: {
    disabled?: boolean
    onClick?: () => void
    isPending?: boolean
  } & NavButton,
) {
  const opacity = props.isPending ? 0.8 : 1
  const v = useAttendeeVariables()

  const fontSize = props.fontSize || DEFAULT_FONT_SIZE
  const iconSize = props.iconSize || props.fontSize || DEFAULT_FONT_SIZE
  const iconColor = props.textColor || DEFAULT_ICON_COLOR

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
      fontSize={fontSize}
    >
      <>
        <IconBox stacked={props.iconStacked}>
          <StyledIcon
            iconClass={props.icon}
            color={iconColor}
            iconSize={iconSize}
          />
        </IconBox>
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
  font-weight: 700;
  padding: 15px 30px;

  &:hover {
    opacity: 0.8;
  }
`

const IconBox = styled.div<{
  stacked?: boolean
}>`
  margin-right: ${(props) => (props.stacked ? 0 : props.theme.spacing[2])};
  margin-bottom: ${(props) => (props.stacked ? props.theme.spacing[2] : 0)};
  display: ${(props) => (props.stacked ? 'block' : 'inline-block')} !important;
`

const StyledIcon = styled(
  (
    props: IconProps & {
      iconSize?: number
    },
  ) => {
    const {iconSize, ...otherProps} = props
    return <Icon {...otherProps} />
  },
)`
  font-size: ${(props) => props.iconSize}px !important;
  width: ${(props) => props.iconSize}px;
  height: ${(props) => props.iconSize}px;
`
