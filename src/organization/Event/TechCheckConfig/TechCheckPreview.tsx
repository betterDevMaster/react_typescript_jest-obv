import React from 'react'
import styled from 'styled-components'
import {useTeamMember} from 'organization/auth'
import {now} from 'lib/date-time'
import {TechCheckProps} from 'Event/Step3/TechCheck'

export function TechCheckPreview(props: {
  body: string
  content: string | null
  render: (previewProps: Omit<TechCheckProps, 'settings'>) => React.ReactElement
}) {
  const {render} = props
  const user = useTeamMember()

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
