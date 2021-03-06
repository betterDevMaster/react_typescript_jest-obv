import {LoginProps} from 'Event/auth/Login'
import styled from 'styled-components'
import React from 'react'
import {eventRoutes} from 'Event/Routes'
import Page, {
  Button,
  Description,
  Title,
  ErrorMessage,
  TextField,
  StyledPaper,
  StyledFormContainer,
  DescriptionText,
} from 'Event/template/Cards/Login/Page'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useCardsTemplate} from 'Event/template/Cards'
import {Icon} from 'lib/fontawesome/Icon'

export default function Login(props: LoginProps) {
  const template = useCardsTemplate()
  const emailLabel = template.login.emailLabel
  const passwordLabel = template.login.passwordLabel

  return (
    <Page isPreview={props.isPreview}>
      <StyledPaper>
        <StyledFormContainer>
          <Title aria-label="event login title">
            {template.login.welcome.text}
          </Title>
          <Description aria-label="event login description">
            {template.login.description.text}
          </Description>
          <form onSubmit={props.onSubmit}>
            <TextField
              label={emailLabel}
              type="email"
              fullWidth
              variant="outlined"
              name="email"
              disabled={props.submitting}
              inputProps={{
                ref: props.register({
                  required: `${emailLabel} is required`,
                }),
                'aria-label': 'email',
              }}
              error={!!props.errors.email}
              helperText={props.errors.email && props.errors.email.message}
            />
            <TextField
              label={passwordLabel}
              type="password"
              fullWidth
              variant="outlined"
              name="password"
              disabled={props.submitting}
              inputProps={{
                ref: props.register({
                  required: `${passwordLabel} is required`,
                }),
                'aria-label': 'password',
              }}
              error={!!props.errors.password}
              helperText={
                props.errors.password && props.errors.password.message
              }
            />
            <ErrorMessage>{props.error}</ErrorMessage>
            <Button
              variant="contained"
              fullWidth
              disabled={props.submitting}
              aria-label="submit login"
              type="submit"
            >
              {template.login.submitButton.label}
            </Button>
          </form>
          <DescriptionText
            color={template.login.additional_description.color}
            fontSize={template.login.additional_description.fontSize}
            mb={4}
          >
            {template.login.additional_description.text}
          </DescriptionText>
          <ForgotPasswordLink
            to={eventRoutes.forgotPassword}
            aria-label="forgot password"
            color={template.login.description.color}
            iconColor={template.login.passwordReset.iconColor}
            label={template.login.passwordReset.linkLabel}
            iconName={template.login.passwordReset.iconName}
          />
        </StyledFormContainer>
      </StyledPaper>
    </Page>
  )
}

function ForgotPasswordLink(props: {
  to: string
  color: string
  iconName: string | null
  iconColor: string
  label: string
}) {
  const {to, color, iconName, label, iconColor} = props
  return (
    <StyledRelativeLink to={to} aria-label="forgot password" color={color}>
      <StyledIcon iconClass={iconName} color={iconColor} />
      {label}
    </StyledRelativeLink>
  )
}

export const StyledRelativeLink = styled(RelativeLink)<{color: string}>`
  color: ${(props) => props.color};
`

const StyledIcon = styled(Icon)`
  margin-right: ${(props) => props.theme.spacing[2]};
`
