import React, {useState} from 'react'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import {TechCheckProps} from 'Event/Step3/TechCheck'
import styled from 'styled-components'
import ProgressBar from 'lib/ui/ProgressBar'
import {useTemplate} from 'Event/TemplateProvider'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {useJoinUrl} from 'Event/EventProvider'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import OfflineDialog from 'lib/ui/OfflineDialog'
import {colors} from 'lib/ui/theme'
import Grid from '@material-ui/core/Grid'
import grey from '@material-ui/core/colors/grey'
import {useWithAttendeeData} from 'Event/auth/data'

const DEFAULT_OFFLINE_TITLE = 'Tech Check Is Currently Offline'
const DISABLED_GREY = grey[400]

export default function TechCheck(props: {user: User} & TechCheckProps) {
  const {techCheck} = props
  const template = useTemplate()
  const joinUrl = useJoinUrl(techCheck.area.id)
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
              <StartButton url={joinUrl} />
            </Grid>
          </Grid>
        </StyledDiv>
      </Container>
    </SimpleBlogPage>
  )
}

function StartButton(props: {url: string | null}) {
  const {url} = props
  const {techCheck} = useTemplate()
  const withAttendeeData = useWithAttendeeData()

  const [offlineDialogVisible, setOfflineDialogVisible] = useState(false)
  const toggleOfflineDialog = () =>
    setOfflineDialogVisible(!offlineDialogVisible)

  const textColor = useTextColor(url)
  const backgroundColor = useBackgroundColor(url)
  const borderColor = useBorderColor(url)

  const onClick = () => {
    if (url) {
      return
    }

    toggleOfflineDialog()
  }
  const button = (
    <StyledButton
      textColor={textColor}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderRadius={techCheck?.buttonBorderRadius || 0}
      borderWidth={techCheck?.buttonBorderWidth || 0}
      aria-label="start tech check"
      onClick={onClick}
      fullWidth
    >
      {withAttendeeData(techCheck?.buttonText || 'Start Tech Check')}
    </StyledButton>
  )

  if (!url) {
    return (
      <>
        <OfflineDialog
          isOpen={offlineDialogVisible}
          title={withAttendeeData(
            techCheck?.offlineTitle || DEFAULT_OFFLINE_TITLE,
          )}
          description={withAttendeeData(techCheck?.offlineDescription || '')}
          onClose={toggleOfflineDialog}
        />
        {button}
      </>
    )
  }

  return (
    <AbsoluteLink to={url} newTab disableStyles aria-label="join link">
      {button}
    </AbsoluteLink>
  )
}

function useTextColor(url: string | null) {
  const {techCheck} = useTemplate()
  if (!url) {
    return '#FFFFFF'
  }

  return techCheck?.buttonTextColor || '#FFFFFF'
}

function useBackgroundColor(url: string | null) {
  const {techCheck} = useTemplate()
  if (!url) {
    return DISABLED_GREY
  }

  return techCheck?.buttonBackground || colors.primary
}

function useBorderColor(url: string | null) {
  const {techCheck} = useTemplate()
  if (!url) {
    return DISABLED_GREY
  }

  return techCheck?.buttonBorderColor || colors.primary
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
