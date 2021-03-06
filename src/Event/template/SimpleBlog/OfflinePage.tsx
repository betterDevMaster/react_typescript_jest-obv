import {OfflinePageProps} from 'Event/JoinArea/OfflinePage'
import React from 'react'
import Page, {DescriptionText} from 'Event/template/SimpleBlog/Login/Page'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import {useGuestVariables} from 'Event'

export default function OfflinePage(props: OfflinePageProps) {
  const {title, description, isPreview} = props
  const v = useGuestVariables()

  return (
    <Page isPreview={isPreview || false}>
      <>
        <Text disableMargin fontSize={24}>
          {v(title)}
        </Text>
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
  disableMargin?: boolean
  fontSize?: number
}) {
  const template = useSimpleBlogTemplate()
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
