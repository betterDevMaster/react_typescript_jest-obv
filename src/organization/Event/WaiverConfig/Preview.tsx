import React from 'react'
import WaiverProvider from 'Event/Step2/WaiverProvider'
import styled from 'styled-components'
import {WaiverConfig} from 'Event'

export default function WaiverPreview(props: {
  body: string
  title: string
  agreeStatement: string
  signaturePrompt: string
  logo: string
  children: React.ReactElement
}) {
  const waiver: WaiverConfig = {
    body: props.body,
    title: props.title,
    agree_statement: props.agreeStatement,
    signature_prompt: props.signaturePrompt,
    is_enabled: false,
    logo: props.logo,
    form: null,
  }

  return (
    <PreviewContainer>
      <WaiverProvider waiver={waiver} isPreview>
        {props.children}
      </WaiverProvider>
    </PreviewContainer>
  )
}

const PreviewContainer = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`
