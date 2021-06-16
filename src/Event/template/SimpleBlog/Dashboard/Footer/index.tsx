import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import styled from 'styled-components'
import Image from 'Event/template/SimpleBlog/Dashboard/Footer/Image'
import {useEvent} from 'Event/EventProvider'
import {useVariables} from 'Event'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export const FOOTER = 'footer'

export default function Footer() {
  const {template} = useSimpleBlog()
  const {footer} = template
  const {event} = useEvent()
  const isEditMode = useEditMode()
  const v = useVariables()

  const isEmpty =
    !footer.termsLink &&
    !footer.privacyLink &&
    !footer.copyrightText &&
    !event.footer_image

  if (isEmpty && !isEditMode) {
    return null
  }

  return (
    <EditComponent component={{type: FOOTER}}>
      <Box
        background={footer.background}
        textColor={footer.textColor}
        aria-label="footer"
      >
        <div>
          <Image />

          {footer.termsLink ? (
            <a href={footer.termsLink} aria-label="terms of service">
              Terms of Service
            </a>
          ) : null}
          {footer.termsLink && footer.privacyLink ? ' • ' : null}
          {footer.privacyLink ? (
            <a href={footer.privacyLink} aria-label="privacy policy">
              Privacy Policy
            </a>
          ) : null}
        </div>
        {footer.copyrightText ? (
          <p aria-label="copyright">{v(footer.copyrightText)}</p>
        ) : null}
      </Box>
    </EditComponent>
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
