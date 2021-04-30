import React from 'react'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import {TechCheckProps} from 'Event/Step3/TechCheck'
import styled from 'styled-components'
import ProgressBar from 'lib/ui/ProgressBar'
import {useTemplate} from 'Event/TemplateProvider'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import {colors} from 'lib/ui/theme'
import Grid from '@material-ui/core/Grid'
import {useWithAttendeeData} from 'Event/auth/data'
import {areaRoutes} from 'Event/Routes'
import {TechCheckConfig} from 'Event'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function TechCheck(props: {user: User} & TechCheckProps) {
  const {techCheck} = props
  const template = useTemplate()
  const withAttendeeData = useWithAttendeeData()

  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <ProgressBar
          value={props.progress}
          barColor={template.progressBar.barColor}
          textColor={template.progressBar.textColor}
          borderRadius={template.progressBar.borderRadius}
          thickness={template.progressBar.thickness}
        />
        <Body
          dangerouslySetInnerHTML={{
            __html: withAttendeeData(techCheck.body),
          }}
        />
        <StyledDiv>
          <Grid container justify="center">
            <Grid item xs={12} md={template.techCheck?.buttonWidth || 12}>
              <StartButton techCheck={props.techCheck} />
            </Grid>
          </Grid>
        </StyledDiv>
      </Container>
    </SimpleBlogPage>
  )
}

function StartButton(props: {techCheck: TechCheckConfig}) {
  const {techCheck: settings} = useTemplate()
  const withAttendeeData = useWithAttendeeData()

  const textColor = settings?.buttonTextColor || '#FFFFFF'
  const backgroundColor = settings?.buttonBackground || colors.primary
  const borderColor = settings?.buttonBorderColor || colors.primary

  const joinLink = areaRoutes(props.techCheck.area.key).root

  return (
    <RelativeLink to={joinLink} newTab>
      <StyledButton
        textColor={textColor}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        borderRadius={settings?.buttonBorderRadius || 0}
        borderWidth={settings?.buttonBorderWidth || 0}
        aria-label="start tech check"
        fullWidth
      >
        {withAttendeeData(settings?.buttonText || 'Start Tech Check')}
      </StyledButton>
    </RelativeLink>
  )
}

const Body = styled.div`
  max-height: 240px;
  overflow-y: auto;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
const StyledDiv = styled.div`
  text-align: center;
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
