import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import styled from 'styled-components'
import Image from 'Event/template/Cards/Dashboard/Footer/Image'
import {useEvent} from 'Event/EventProvider'
import {useAttendeeVariables} from 'Event'
import {useCardsTemplate} from 'Event/template/Cards'
import {useToggle} from 'lib/toggle'
import {FooterConfig} from 'Event/template/Cards/Dashboard/Footer/FooterConfig'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'

export default function Footer() {
  const {footer} = useCardsTemplate()
  const {event} = useEvent()
  const isEditMode = useEditMode()
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const isEmpty =
    !footer.termsLink &&
    !footer.privacyLink &&
    !footer.copyrightText &&
    !event.footer_image

  if (isEmpty && !isEditMode) {
    return null
  }

  return (
    <>
      <EditModeOnly>
        <FooterConfig isVisible={configVisible} onClose={toggleConfig} />
      </EditModeOnly>
      <Editable onEdit={toggleConfig}>
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
      </Editable>
    </>
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
