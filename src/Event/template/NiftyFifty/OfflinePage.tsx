import React from 'react'
import styled from 'styled-components'

import {useGuestVariables} from 'Event'
import {OfflinePageProps} from 'Event/JoinArea/OfflinePage'
import Page, {DescriptionText} from 'Event/template/NiftyFifty/Login/Page'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

export default function OfflinePage(props: OfflinePageProps) {
  const {title, description, isPreview} = props
  const v = useGuestVariables()

  return (
    <Page isPreview={isPreview || false}>
      {/* <Box> */}
      <Text fontSize={24}>{v(title)}</Text>
      <Text>
        <div dangerouslySetInnerHTML={{__html: v(description)}} />
      </Text>
      {/* </Box> */}
    </Page>
  )
}

function Text(props: {
  children: string | React.ReactElement
  'aria-label'?: string
  fontSize?: number
}) {
  const template = useNiftyFiftyTemplate()
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

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
