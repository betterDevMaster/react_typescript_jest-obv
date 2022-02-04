import React from 'react'
import Page from 'Event/template/NiftyFifty/Page'
import styled from 'styled-components'

import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import {TechCheckConfig, useAttendeeVariables} from 'Event'
import {areaRoutes} from 'Event/Routes'
import CustomButtons from 'Event/Step3/CustomButtons'
import {TechCheckProps} from 'Event/Step3/TechCheck'
import {DEFAULTS, NiftyFifty} from 'Event/template/NiftyFifty'
import LeftPanel from 'Event/template/NiftyFifty/check-in/LeftPanel'
import RightPanel from 'Event/template/NiftyFifty/check-in/RightPanel'
import MobilePanel from 'Event/template/NiftyFifty/check-in/MobilePanel'

import {RelativeLink} from 'lib/ui/link/RelativeLink'
import TextEditorContent from 'lib/ui/form/TextEditor/Content'

export type NiftyFiftyTechCheckProps = TechCheckProps & {
  settings: NiftyFifty['techCheck']
}

export default function TechCheck(props: NiftyFiftyTechCheckProps) {
  return (
    <Page
      Left={<LeftPanel user={props.user} />}
      Right={
        <RightPanel step={3}>
          <Content {...props} />
        </RightPanel>
      }
      Mobile={
        <MobilePanel step={3} user={props.user}>
          <Content {...props} />
        </MobilePanel>
      }
    />
  )
}

function Content(props: TechCheckProps) {
  const {techCheck} = props
  const v = useAttendeeVariables()

  return (
    <BodyContent>
      <Body>{v(techCheck.body)}</Body>
      <Buttons techCheck={techCheck} settings={props.settings} />
      <AdditionalContent>
        {v(techCheck.additional_content || '')}
      </AdditionalContent>
    </BodyContent>
  )
}

export function Buttons(props: {
  techCheck: TechCheckConfig
  settings: NiftyFifty['techCheck']
}) {
  const {settings} = props

  if (!settings?.hasCustomButtons || !settings.buttons) {
    return <DefaultButton techCheck={props.techCheck} settings={settings} />
  }

  return <CustomButtons buttons={settings.buttons} />
}

function DefaultButton(props: {
  techCheck: TechCheckConfig
  settings: NiftyFifty['techCheck']
}) {
  const {settings} = props

  return (
    <ButtonBox>
      <Grid container justify="center">
        <Grid
          item
          xs={12}
          md={settings?.buttonWidth || DEFAULTS.techCheck.buttonWidth}
        >
          <StartButton techCheck={props.techCheck} settings={settings} />
        </Grid>
      </Grid>
    </ButtonBox>
  )
}

function StartButton(props: {
  techCheck: TechCheckConfig
  settings: NiftyFifty['techCheck']
}) {
  const {settings} = props
  const v = useAttendeeVariables()

  const textColor = settings?.buttonTextColor || '#FFFFFF'
  const backgroundColor =
    settings?.buttonBackground || DEFAULTS.techCheck.buttonBackground
  const buttonHoverBackground =
    settings?.buttonHoverBackground || DEFAULTS.techCheck.buttonHoverBackground
  const borderColor =
    settings?.buttonBorderColor || DEFAULTS.techCheck.buttonBorderColor

  const joinLink = areaRoutes(props.techCheck.area_key || '').root

  return (
    <RelativeLink to={joinLink} newTab disableStyles>
      <StyledButton
        textColor={textColor}
        backgroundColor={backgroundColor}
        buttonHoverBackground={buttonHoverBackground}
        borderColor={borderColor}
        borderRadius={
          settings?.buttonBorderRadius || DEFAULTS.techCheck.buttonBorderRadius
        }
        borderWidth={
          settings?.buttonBorderWidth || DEFAULTS.techCheck.buttonBorderWidth
        }
        aria-label="start tech check"
        fullWidth
      >
        {v(settings?.buttonText || DEFAULTS.techCheck.buttonText)}
      </StyledButton>
    </RelativeLink>
  )
}

const Body = styled(TextEditorContent)`
  max-height: 100%;
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 20px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 20px;
    line-height: 32px;
    margin-bottom: 32px;
  }
`
const ButtonBox = styled.div`
  text-align: center;
`
const AdditionalContent = styled(TextEditorContent)`
  max-height: 100%;
  margin-top: 16px;
  font-size: 12px;
  line-height: 20px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 20px;
    line-height: 32px;
    margin-top: 32px;
  }
`
const BodyContent = styled.div`
  margin-top: ${(props) => props.theme.spacing[5]};
`
const StyledButton = styled(
  ({
    textColor: _1,
    backgroundColor: _2,
    buttonHoverBackground: _3,
    borderRadius: _4,
    borderColor: _5,
    borderWidth: _6,
    ...otherProps
  }: ButtonProps & {
    textColor: string
    backgroundColor: string
    buttonHoverBackground: string
    borderRadius: number
    borderColor: string
    borderWidth: number
  }) => <MuiButton {...otherProps} />,
)`
  color: ${(props) => props.textColor};
  border: ${(props) => props.borderWidth}px solid
    ${(props) => props.borderColor};
  background: ${(props) => props.backgroundColor};
  border-radius: ${(props) => props.borderRadius}px;
  &:hover {
    background: ${(props) => props.buttonHoverBackground};
  }
`
