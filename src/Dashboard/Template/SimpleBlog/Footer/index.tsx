import {useCurrent, useEditMode} from 'Dashboard/edit/state/edit-mode'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import React from 'react'
import styled from 'styled-components'

export const FOOTER = 'footer'

export default function Footer(props: {footer: SimpleBlog['footer']}) {
  const footer = useCurrent(
    (state) => state.dashboardEditor.footer,
    props.footer,
  )
  const isEditMode = useEditMode()
  const isEmpty =
    !footer.termsLink && !footer.privacyLink && !footer.copyrightText

  if (isEmpty && !isEditMode) {
    return null
  }

  return (
    <EditComponent type={FOOTER}>
      <Box
        background={footer.background}
        textColor={footer.textColor}
        aria-label="footer"
      >
        <div>
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
          <p aria-label="copyright">{footer.copyrightText}</p>
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
