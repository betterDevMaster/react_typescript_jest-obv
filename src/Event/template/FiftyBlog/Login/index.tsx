import {LoginProps} from 'Event/auth/Login'
import styled from 'styled-components'
import React from 'react'
import {eventRoutes} from 'Event/Routes'
import Page, {
  Button,
  Description,
  ErrorMessage,
  TextField,
} from 'Event/template/FiftyBlog/Login/Page'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {useGuestVariables} from 'Event'

export default function Login(props: LoginProps) {
  const template = useFiftyBlogTemplate()
  const {login} = template
  const v = useGuestVariables()

  const emailLabel = v(login.emailLabel)
  const passwordLabel = v(login.passwordLabel)
  console.log('props -----', props)
  return (
    <Page isPreview={props.isPreview}>
      <Container>
        <Description aria-label="event login description">
          {v(login?.description.text)}
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
            style={{margin: 0}}
            inputProps={{
              ref: props.register({
                required: `${passwordLabel} is required`,
              }),
              'aria-label': 'password',
            }}
            error={!!props.errors.password}
            helperText={props.errors.password && props.errors.password.message}
          />
          <div className="w-full mb-6 text-right">
            <StyledRelativeLink
              to={eventRoutes.forgotPassword}
              aria-label="forgot password"
              color={login.description.color}
            >
              {v(login.passwordReset.linkLabel)}
            </StyledRelativeLink>
          </div>
          <ErrorMessage>{props.error}</ErrorMessage>
          <Button
            variant="contained"
            fullWidth
            disabled={props.submitting}
            aria-label="submit login"
            type="submit"
          >
            {login.submitButton.label}
          </Button>
        </form>
      </Container>
    </Page>
  )
}

export const StyledRelativeLink = styled(RelativeLink)<{color: string}>`
  color: ${(props) => props.color};
`
export const Container = styled.div`
  padding: 4rem 7rem;
  min-height: 600px;
`
