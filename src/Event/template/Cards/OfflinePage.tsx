import {OfflinePageProps} from 'Event/JoinArea/OfflinePage'
import React from 'react'
import Page, {DescriptionText} from 'Event/template/Cards/Login/Page'
import {useCards} from 'Event/template/Cards'

export default function OfflinePage(props: OfflinePageProps) {
  const {title, description, isPreview} = props
  return (
    <Page isPreview={isPreview || false}>
      <>
        <Text disableMargin fontSize={24}>
          {title}
        </Text>
        <Text>
          <div dangerouslySetInnerHTML={{__html: description}} />
        </Text>
      </>
    </Page>
  )
}

function Text(props: {
  children: string | React.ReactElement
  'aria-label'?: string
  disableMargin?: boolean
  fontSize?: number
}) {
  const {template} = useCards()
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
