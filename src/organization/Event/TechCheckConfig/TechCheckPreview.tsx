import React from 'react'
import styled from 'styled-components'
import {now} from 'lib/date-time'
import {TechCheckProps} from 'Event/Step3/TechCheck'
import {useObvioUser} from 'obvio/auth'

export function TechCheckPreview(props: {
  body: string
  content: string | null
  render: (previewProps: Omit<TechCheckProps, 'settings'>) => React.ReactElement
}) {
  const {render} = props
  const user = useObvioUser()

  /**
   * Build event.tech_check dynamically for the
   * preview. We will omit the settings to
   * let the template pass that in.
   */
  const previewProps = {
    techCheck: {
      body: props.body,
      additional_content: props.content,
      is_enabled: false,
      area_key: null,
      start: now(),
    },
    progress: 75,
    isPreview: true,
    user,
  }

  return <PreviewContainer>{render(previewProps)}</PreviewContainer>
}

const PreviewContainer = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`
