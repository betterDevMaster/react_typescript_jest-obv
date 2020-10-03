import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import React from 'react'
import styled from 'styled-components'

export default function Footer(props: SimpleBlog) {
  const hasField =
    props.footerCopyrightText ||
    props.footerPrivacyLink ||
    props.footerTermsLink

  if (!hasField) {
    return null
  }

  return (
    <Box background={props.footerBackground} textColor={props.footerTextColor}>
      <div>
        {props.footerTermsLink ? (
          <a href={props.footerTermsLink} aria-label="terms of service">
            Terms of Service
          </a>
        ) : null}
        {props.footerTermsLink && props.footerPrivacyLink ? ' • ' : null}
        {props.footerPrivacyLink ? (
          <a href={props.footerPrivacyLink} aria-label="privacy policy">
            Privacy Policy
          </a>
        ) : null}
      </div>
      {props.footerCopyrightText ? <p>{props.footerCopyrightText}</p> : null}
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
