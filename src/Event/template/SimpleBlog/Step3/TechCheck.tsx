import React from 'react'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Container from '@material-ui/core/Container'
import styled from 'styled-components'
import ProgressBar from 'lib/ui/ProgressBar'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import {colors} from 'lib/ui/theme'
import Grid from '@material-ui/core/Grid'
import {useAttendeeVariables} from 'Event'
import {areaRoutes} from 'Event/Routes'
import {TechCheckConfig} from 'Event'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import CustomButtons from 'Event/Step3/CustomButtons'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import Content from 'lib/ui/form/TextEditor/Content'
import {TechCheckProps} from 'Event/Step3/TechCheck'

export type SimpleBlogTechCheckProps = TechCheckProps & {
  settings: SimpleBlog['techCheck']
}

export default function TechCheck(props: SimpleBlogTechCheckProps) {
  const {techCheck} = props
  const {template} = useSimpleBlog()
  const v = useAttendeeVariables()

  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="md">
        <ProgressBar
          showing={template.progressBar.showing}
          value={props.progress}
          barColor={template.progressBar.barColor}
          textColor={template.progressBar.textColor}
          borderRadius={template.progressBar.borderRadius}
          thickness={template.progressBar.thickness}
        />
        <Body>{v(techCheck.body)}</Body>
        <Buttons techCheck={techCheck} settings={props.settings} />
        <AdditionalContent>
          {v(techCheck.additional_content || '')}
        </AdditionalContent>
      </Container>
    </SimpleBlogPage>
  )
}

export function Buttons(props: {
  techCheck: TechCheckConfig
  settings: SimpleBlog['techCheck']
}) {
  const {settings} = props

  if (!settings?.hasCustomButtons || !settings.buttons) {
    return <DefaultButton techCheck={props.techCheck} settings={settings} />
  }

  return <CustomButtons buttons={settings.buttons} />
}

function DefaultButton(props: {
  techCheck: TechCheckConfig
  settings: SimpleBlog['techCheck']
}) {
  const {settings} = props

  return (
    <ButtonBox>
      <Grid container justify="center">
        <Grid item xs={12} md={settings?.buttonWidth || 12}>
          <StartButton techCheck={props.techCheck} settings={settings} />
        </Grid>
      </Grid>
    </ButtonBox>
  )
}

function StartButton(props: {
  techCheck: TechCheckConfig
  settings: SimpleBlog['techCheck']
}) {
  const {settings} = props
  const v = useAttendeeVariables()

  const textColor = settings?.buttonTextColor || '#FFFFFF'
  const backgroundColor = settings?.buttonBackground || colors.primary
  const borderColor = settings?.buttonBorderColor || colors.primary

  const joinLink = areaRoutes(props.techCheck.area_key || '').root

  return (
    <RelativeLink to={joinLink} newTab disableStyles>
      <StyledButton
        textColor={textColor}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        borderRadius={settings?.buttonBorderRadius || 0}
        borderWidth={settings?.buttonBorderWidth || 0}
        aria-label="start tech check"
        fullWidth
      >
        {v(settings?.buttonText || 'Start Tech Check')}
      </StyledButton>
    </RelativeLink>
  )
}

const Body = styled(Content)`
  max-height: 100%;
  overflow-y: auto;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
const ButtonBox = styled.div`
  text-align: center;
`
const AdditionalContent = styled(Content)`
  max-height: 100%;
  margin-bottom: ${(props) => props.theme.spacing[4]};
  margin-top: ${(props) => props.theme.spacing[8]};
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
  background-color: ${(props) => props.backgroundColor} !important;
  border-radius: ${(props) => props.borderRadius}px !important;
`
