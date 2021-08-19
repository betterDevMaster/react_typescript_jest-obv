import React from 'react'
import Page from 'Event/template/Panels/Page'
import styled from 'styled-components'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {useVariables} from 'Event'
import {areaRoutes} from 'Event/Routes'
import {TechCheckConfig} from 'Event'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import CustomButtons from 'Event/Step3/CustomButtons'
import TextEditorContent from 'lib/ui/form/TextEditor/Content'
import {TechCheckProps} from 'Event/Step3/TechCheck'
import {DEFAULTS, Panels} from 'Event/template/Panels'
import LeftPanel from 'Event/template/Panels/check-in/LeftPanel'
import RightPanel from 'Event/template/Panels/check-in/RightPanel'
import MobilePanel from 'Event/template/Panels/check-in/MobilePanel'

export type PanelsTechCheckProps = TechCheckProps & {
  settings: Panels['techCheck']
}

export default function TechCheck(props: PanelsTechCheckProps) {
  return (
    <Page
      Left={<LeftPanel step={3} />}
      Right={
        <RightPanel>
          <Content {...props} />
        </RightPanel>
      }
      Mobile={
        <MobilePanel step={3}>
          <Content {...props} />
        </MobilePanel>
      }
    />
  )
}

function Content(props: TechCheckProps) {
  const {techCheck} = props
  const v = useVariables()

  return (
    <div>
      <Body>{v(techCheck.body)}</Body>
      <Buttons techCheck={techCheck} settings={props.settings} />
      <AdditionalContent>
        {v(techCheck.additional_content || '')}
      </AdditionalContent>
    </div>
  )
}

export function Buttons(props: {
  techCheck: TechCheckConfig
  settings: Panels['techCheck']
}) {
  const {settings} = props

  if (!settings?.hasCustomButtons || !settings.buttons) {
    return <DefaultButton techCheck={props.techCheck} settings={settings} />
  }

  return <CustomButtons buttons={settings.buttons} />
}

function DefaultButton(props: {
  techCheck: TechCheckConfig
  settings: Panels['techCheck']
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
  settings: Panels['techCheck']
}) {
  const {settings} = props
  const v = useVariables()

  const textColor = settings?.buttonTextColor || '#FFFFFF'
  const backgroundColor =
    settings?.buttonBackground || DEFAULTS.techCheck.buttonBackground
  const borderColor =
    settings?.buttonBorderColor || DEFAULTS.techCheck.buttonBorderColor

  const joinLink = areaRoutes(props.techCheck.area_key || '').root

  return (
    <RelativeLink to={joinLink} newTab disableStyles>
      <StyledButton
        textColor={textColor}
        backgroundColor={backgroundColor}
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
  overflow-y: auto;
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 24px;

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
    font-size: 16px;
    line-height: 32px;
    margin-top: 32px;
  }
`

const StyledButton = styled(
  ({
    textColor,
    backgroundColor,
    borderRadius,
    borderColor,
    borderWidth,
    ...otherProps
  }: ButtonProps & {
    textColor: string
    backgroundColor: string
    borderRadius: number
    borderColor: string
    borderWidth: number
  }) => <MuiButton {...otherProps} />,
)`
  color: ${(props) => props.textColor}!important;
  border: ${(props) => props.borderWidth}px solid
    ${(props) => props.borderColor} !important;
  background: ${(props) => props.backgroundColor} !important;
  border-radius: ${(props) => props.borderRadius}px !important;
`
