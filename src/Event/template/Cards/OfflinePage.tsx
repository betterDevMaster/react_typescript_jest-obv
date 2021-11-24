import {OfflinePageProps} from 'Event/JoinArea/OfflinePage'
import React from 'react'
import Page, {
  DescriptionText,
  StyledPaper,
  StyledFormContainer,
  Title,
} from 'Event/template/Cards/Login/Page'
import {useCardsTemplate} from 'Event/template/Cards'
import {useGuestVariables} from 'Event'

export default function OfflinePage(props: OfflinePageProps) {
  const {title, description, isPreview} = props
  const v = useGuestVariables()
  return (
    <Page isPreview={isPreview || false}>
      <StyledPaper>
        <StyledFormContainer>
          <Title>{v(title)}</Title>
          <Text>
            <div dangerouslySetInnerHTML={{__html: v(description)}} />
          </Text>
        </StyledFormContainer>
      </StyledPaper>
    </Page>
  )
}

function Text(props: {
  children: string | React.ReactElement
  'aria-label'?: string
  disableMargin?: boolean
  fontSize?: number
}) {
  const template = useCardsTemplate()
  const color = template.login.description.color
  const fontSize = props.fontSize
    ? props.fontSize
    : template.login.description.fontSize
  if (!props.children) {
    return null
  }

  return (
    <DescriptionText
      color={color}
      fontSize={fontSize}
      disableMargin={props.disableMargin}
      aria-label={props['aria-label']}
    >
      {props.children}
    </DescriptionText>
  )
}
