import {SimpleBlogDashboard} from 'Dashboard/templates/SimpleBlog'
import React from 'react'
import styled from 'styled-components'

export default function Footer(props: SimpleBlogDashboard['footer']) {
  const hasField = props.copyrightText || props.privacyLink || props.termsLink
  if (!hasField) {
    return null
  }

  return (
    <Box background={props.background} textColor={props.textColor}>
      <div>
        {props.termsLink ? (
          <a href={props.termsLink} aria-label="terms of service">
            Terms of Service
          </a>
        ) : null}
        {props.termsLink && props.privacyLink ? ' • ' : null}
        {props.privacyLink ? (
          <a href={props.privacyLink} aria-label="privacy policy">
            Privacy Policy
          </a>
        ) : null}
      </div>
      {props.copyrightText ? <p>{props.copyrightText}</p> : null}
    </Box>
  )
}

const Box = styled.div<{background: string; textColor: string}>`
  padding: 40px 25px 25px;
  background: ${(props) => props.background};
  color: ${(props) => props.textColor};
  text-align: center;

  a {
    color: ${(props) => props.textColor};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`
