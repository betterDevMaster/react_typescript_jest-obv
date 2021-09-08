import {OfflinePageProps} from 'Event/JoinArea/OfflinePage'
import React from 'react'
import Page, {DescriptionText} from 'Event/template/Panels/Login/Page'
import {usePanels} from 'Event/template/Panels'
import {useGuestVariables} from 'Event'

export default function OfflinePage(props: OfflinePageProps) {
  const {title, description, isPreview} = props
  const v = useGuestVariables()

  return (
    <Page isPreview={isPreview || false}>
      <>
        <Text fontSize={24}>{v(title)}</Text>
        <Text>
          <div dangerouslySetInnerHTML={{__html: v(description)}} />
        </Text>
      </>
    </Page>
  )
}

function Text(props: {
  children: string | React.ReactElement
  'aria-label'?: string
  fontSize?: number
}) {
  const {template} = usePanels()
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
      aria-label={props['aria-label']}
    >
      {props.children}
    </DescriptionText>
  )
}
